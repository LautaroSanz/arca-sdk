import * as soap from "soap";
import { XMLParser } from "fast-xml-parser";
import { type AccessTicket } from "./access-ticket";
import type { TicketStorage } from "../storage/ticket-storage";
import { MemoryTicketStorage } from "../storage/memory-storage";
import { type NtpClock, createNtpClock } from "./ntp";
import { signCms } from "../crypto/sign";
import { buildTra } from "./tra-builder";
import { type Environment, ENDPOINTS } from "../../config/endpoints";
import { WsaaError } from "../errors/wsaa";
import { SoapError } from "../errors/soap";
import { type Logger, noopLogger } from "../logging/logger";

export type LoginCmsFn = (endpoint: string, cmsBase64: string) => Promise<string>;

export interface WsaaClientOptions {
  cuit: string;
  cert: string;
  key: string;
  environment: Environment;
  storage?: TicketStorage;
  clock?: NtpClock;
  ttlSeconds?: number;
  logger?: Logger;
  loginCmsFn?: LoginCmsFn;
}

async function defaultLoginCmsFn(endpoint: string, cmsBase64: string): Promise<string> {
  const client = await soap.createClientAsync(`${endpoint}?wsdl`);
  const call = client as unknown as {
    loginCmsAsync: (args: { in0: string }) => Promise<[{ loginCmsReturn?: string }]>;
  };
  const result = await call.loginCmsAsync({ in0: cmsBase64 });
  return result[0].loginCmsReturn ?? "";
}

export class WsaaClient {
  private readonly cuit: string;
  private readonly cert: string;
  private readonly key: string;
  private readonly endpoint: string;
  private readonly storage: TicketStorage;
  private readonly clock: NtpClock;
  private readonly ttlSeconds: number;
  private readonly logger: Logger;
  private readonly loginCmsFn: LoginCmsFn;

  constructor(opts: WsaaClientOptions) {
    this.cuit = opts.cuit;
    this.cert = opts.cert;
    this.key = opts.key;
    this.endpoint = ENDPOINTS[opts.environment].wsaa;
    this.storage = opts.storage ?? new MemoryTicketStorage();
    this.clock = opts.clock ?? createNtpClock({ logger: opts.logger });
    this.ttlSeconds = opts.ttlSeconds ?? 600;
    this.logger = opts.logger ?? noopLogger;
    this.loginCmsFn = opts.loginCmsFn ?? defaultLoginCmsFn;
  }

  async getTicket(service: string): Promise<AccessTicket> {
    const cached = await this.storage.get(service, this.cuit);
    if (cached) {
      this.logger.debug("WSAA ticket cache hit", { service, cuit: this.cuit });
      return cached;
    }

    const now = await this.clock.now();
    const tra = buildTra({ service, now, ttlSeconds: this.ttlSeconds });
    const cms = signCms({ content: tra, cert: this.cert, key: this.key });

    let loginResponse: string;
    try {
      loginResponse = await this.loginCmsFn(this.endpoint, cms.base64);
    } catch (err) {
      throw this.mapSoapErrorToWsaa(err);
    }

    if (!loginResponse) {
      throw new WsaaError("WSAA.EMPTY_RESPONSE", {
        message: "WSAA returned empty loginCmsReturn",
        context: { service, cuit: this.cuit },
      });
    }

    const ticket = this.parseLoginCmsResponse(service, loginResponse);
    await this.storage.set(ticket);
    this.logger.info("WSAA ticket issued", {
      service,
      cuit: this.cuit,
      expiresAt: ticket.expirationTime.toISOString(),
    });
    return ticket;
  }

  private parseLoginCmsResponse(service: string, xml: string): AccessTicket {
    const parser = new XMLParser({ ignoreAttributes: true });
    let parsed: {
      loginTicketResponse?: {
        credentials?: { token?: string; sign?: string };
        header?: { generationTime?: string; expirationTime?: string };
      };
    };
    try {
      parsed = parser.parse(xml) as typeof parsed;
    } catch (err) {
      throw new WsaaError("WSAA.PARSE_FAILED", {
        message: "Failed to parse WSAA response XML",
        cause: err,
        context: { service, cuit: this.cuit },
      });
    }
    const resp = parsed.loginTicketResponse;
    const token = resp?.credentials?.token;
    const sign = resp?.credentials?.sign;
    const generationTimeStr = resp?.header?.generationTime;
    const expirationTimeStr = resp?.header?.expirationTime;
    if (!token || !sign || !generationTimeStr || !expirationTimeStr) {
      throw new WsaaError("WSAA.INCOMPLETE_RESPONSE", {
        message: "WSAA response missing required fields",
        context: { service, cuit: this.cuit },
      });
    }
    return {
      service,
      cuit: this.cuit,
      token,
      sign,
      generationTime: new Date(generationTimeStr),
      expirationTime: new Date(expirationTimeStr),
      raw: xml,
    };
  }

  private mapSoapErrorToWsaa(err: unknown): WsaaError | SoapError {
    const e = err as {
      message?: string;
      root?: { Envelope?: { Body?: { Fault?: { faultstring?: string } } } };
    };
    const faultString = e?.root?.Envelope?.Body?.Fault?.faultstring;
    if (faultString) {
      if (/vigente|has not expired/i.test(faultString)) {
        return new WsaaError("WSAA.TICKET_STILL_VALID", {
          message: faultString,
          cause: err,
        });
      }
      if (/expir/i.test(faultString)) {
        return new WsaaError("WSAA.TRA_EXPIRED", {
          message: faultString,
          cause: err,
        });
      }
      return new WsaaError("WSAA.FAULT", { message: faultString, cause: err });
    }
    return new SoapError("SOAP.NETWORK", {
      message: e?.message ?? "SOAP transport error",
      cause: err,
    });
  }
}
