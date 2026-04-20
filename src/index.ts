import { WsaaClient } from "./core/wsaa/client";
import { createSoapClient, type SoapClient } from "./core/soap/client";
import { withAuth } from "./core/soap/auth-proxy";
import { ENDPOINTS, type Environment } from "./config/endpoints";
import { dummy } from "./services/electronic-billing/operations/dummy";
import { ultimoAutorizado } from "./services/electronic-billing/operations/ultimo-autorizado";
import { solicitarCae } from "./services/electronic-billing/operations/fecae-solicitar";
import {
  getTiposCbte,
  getTiposConcepto,
  getTiposDoc,
  getTiposIva,
  getTiposMonedas,
  getTiposOpcional,
  getTiposTributos,
  getPtosVenta,
  getCotizacion,
} from "./services/electronic-billing/operations/params";
import type {
  FeCaeSolicitarInput,
  FeCaeSolicitarResult,
} from "./services/electronic-billing/operations/fecae-solicitar";
import type {
  UltimoAutorizadoInput,
  UltimoAutorizadoResult,
} from "./services/electronic-billing/operations/ultimo-autorizado";
import type { DummyResult } from "./services/electronic-billing/operations/dummy";
import type {
  TipoCbte,
  TipoConcepto,
  TipoDoc,
  TipoIva,
  TipoMoneda,
  TipoOpcional,
  TipoTributo,
  PtoVenta,
  Cotizacion,
} from "./services/electronic-billing/types/params";
import type { TicketStorage } from "./core/storage/ticket-storage";
import type { NtpClock } from "./core/wsaa/ntp";
import type { Logger } from "./core/logging/logger";

export const SDK_VERSION = "0.1.0" as const;

export interface ArcaOptions {
  cuit: string;
  cert: string;
  key: string;
  environment: Environment;
  storage?: TicketStorage;
  clock?: NtpClock;
  logger?: Logger;
}

export interface ElectronicBillingParams {
  tiposCbte(): Promise<TipoCbte[]>;
  tiposConcepto(): Promise<TipoConcepto[]>;
  tiposDoc(): Promise<TipoDoc[]>;
  tiposIva(): Promise<TipoIva[]>;
  tiposMonedas(): Promise<TipoMoneda[]>;
  tiposOpcional(): Promise<TipoOpcional[]>;
  tiposTributos(): Promise<TipoTributo[]>;
  ptosVenta(): Promise<PtoVenta[]>;
  cotizacion(monId: string): Promise<Cotizacion>;
}

export interface ElectronicBillingService {
  dummy(): Promise<DummyResult>;
  createInvoice(input: FeCaeSolicitarInput): Promise<FeCaeSolicitarResult>;
  lastAuthorized(input: UltimoAutorizadoInput): Promise<UltimoAutorizadoResult>;
  params: ElectronicBillingParams;
}

export class Arca {
  readonly electronicBilling: ElectronicBillingService;

  constructor(opts: ArcaOptions) {
    const wsaa = new WsaaClient({
      cuit: opts.cuit,
      cert: opts.cert,
      key: opts.key,
      environment: opts.environment,
      ...(opts.storage ? { storage: opts.storage } : {}),
      ...(opts.clock ? { clock: opts.clock } : {}),
      ...(opts.logger ? { logger: opts.logger } : {}),
    });

    const wsfev1Endpoint = ENDPOINTS[opts.environment].wsfev1;
    let authed: SoapClient | null = null;

    const getAuthed = async (): Promise<SoapClient> => {
      if (authed) return authed;
      const raw = await createSoapClient({
        wsdl: { url: `${wsfev1Endpoint}?WSDL` },
        endpoint: wsfev1Endpoint,
      });
      authed = withAuth({ soap: raw, wsaa, service: "wsfe" });
      return authed;
    };

    this.electronicBilling = {
      dummy: async () => dummy(await getAuthed()),
      createInvoice: async (input) => solicitarCae(await getAuthed(), input),
      lastAuthorized: async (input) => ultimoAutorizado(await getAuthed(), input),
      params: {
        tiposCbte: async () => getTiposCbte(await getAuthed()),
        tiposConcepto: async () => getTiposConcepto(await getAuthed()),
        tiposDoc: async () => getTiposDoc(await getAuthed()),
        tiposIva: async () => getTiposIva(await getAuthed()),
        tiposMonedas: async () => getTiposMonedas(await getAuthed()),
        tiposOpcional: async () => getTiposOpcional(await getAuthed()),
        tiposTributos: async () => getTiposTributos(await getAuthed()),
        ptosVenta: async () => getPtosVenta(await getAuthed()),
        cotizacion: async (monId: string) => getCotizacion(await getAuthed(), monId),
      },
    };
  }
}

export type {
  FeCaeSolicitarInput,
  FeCaeSolicitarResult,
  DuplicateInvoiceErrorOptions,
} from "./services/electronic-billing/operations/fecae-solicitar";
export { DuplicateInvoiceError } from "./services/electronic-billing/operations/fecae-solicitar";
export type {
  UltimoAutorizadoInput,
  UltimoAutorizadoResult,
} from "./services/electronic-billing/operations/ultimo-autorizado";
export type { DummyResult } from "./services/electronic-billing/operations/dummy";
export * from "./services/electronic-billing/types";

export type { Environment, ServiceEndpoints } from "./config/endpoints";
export { ENDPOINTS } from "./config/endpoints";

export type { TicketStorage } from "./core/storage/ticket-storage";
export { MemoryTicketStorage } from "./core/storage/memory-storage";
export { FsTicketStorage, type FsStorageOptions } from "./core/storage/fs-storage";

export type { AccessTicket } from "./core/wsaa/access-ticket";
export { isExpired, isAboutToExpire } from "./core/wsaa/access-ticket";

export type { NtpClock, NtpClockOptions } from "./core/wsaa/ntp";
export { createNtpClock, createSystemClock } from "./core/wsaa/ntp";

export type { Logger, LogLevel } from "./core/logging/logger";
export { noopLogger, consoleLogger } from "./core/logging/logger";

export {
  ArcaError,
  ConfigError,
  CryptoError,
  WsaaError,
  SoapError,
  WsnError,
  WsfeError,
  TimeSkewError,
  isRetryable,
} from "./core/errors";
export type {
  ArcaErrorOptions,
  ConfigErrorCode,
  CryptoErrorCode,
  WsaaErrorCode,
  WsaaErrorOptions,
  SoapErrorCode,
  WsfeErrorCode,
} from "./core/errors";
