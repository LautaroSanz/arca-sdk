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
import { getPersonaA4 } from "./services/register/operations/a4";
import { getPersonaA10 } from "./services/register/operations/a10";
import { getPersonaA13 } from "./services/register/operations/a13";
import type { PersonaReturn } from "./services/register/types/persona";
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

export const SDK_VERSION = "0.2.0" as const;

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

export interface RegisterService {
  personaA4(cuit: number | string): Promise<PersonaReturn>;
  personaA10(cuit: number | string): Promise<PersonaReturn>;
  personaA13(cuit: number | string): Promise<PersonaReturn>;
}

export class Arca {
  readonly electronicBilling: ElectronicBillingService;
  readonly register: RegisterService;

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

    const endpoints = ENDPOINTS[opts.environment];
    const rawClients = new Map<string, Promise<SoapClient>>();
    const getRaw = (endpoint: string): Promise<SoapClient> => {
      let p = rawClients.get(endpoint);
      if (p) return p;
      p = createSoapClient({
        wsdl: { url: `${endpoint}?WSDL` },
        endpoint,
      });
      rawClients.set(endpoint, p);
      return p;
    };

    let wsfeAuthed: SoapClient | null = null;
    const getAuthed = async (): Promise<SoapClient> => {
      if (wsfeAuthed) return wsfeAuthed;
      const raw = await getRaw(endpoints.wsfev1);
      wsfeAuthed = withAuth({ soap: raw, wsaa, service: "wsfe" });
      return wsfeAuthed;
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

    this.register = {
      personaA4: async (cuit) => getPersonaA4(await getRaw(endpoints.padronA4), wsaa, cuit),
      personaA10: async (cuit) => getPersonaA10(await getRaw(endpoints.padronA10), wsaa, cuit),
      personaA13: async (cuit) => getPersonaA13(await getRaw(endpoints.padronA13), wsaa, cuit),
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
  WsPadronError,
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
  WsPadronErrorCode,
  WsPadronErrorOptions,
} from "./core/errors";

export type {
  PersonaReturn,
  Domicilio,
  Actividad,
  Impuesto,
  CategoriaMonotributo,
  TipoPersona,
} from "./services/register/types/persona";
