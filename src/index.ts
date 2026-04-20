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
import { fexDummy } from "./services/export-billing/operations/dummy";
import { fexAuthorize } from "./services/export-billing/operations/authorize";
import { fexLastCmp } from "./services/export-billing/operations/last-cmp";
import { fexLastId } from "./services/export-billing/operations/last-id";
import { fexCotizacion } from "./services/export-billing/operations/cotizacion";
import type {
  FexAuthorizeInput,
  FexAuthorizeResult,
} from "./services/export-billing/operations/authorize";
import type {
  FexLastCmpInput,
  FexLastCmpResult,
} from "./services/export-billing/operations/last-cmp";
import type { FexDummyResult } from "./services/export-billing/operations/dummy";
import type { FEXResultCotiz } from "./services/export-billing/types/response";
import { mtxcaDummy } from "./services/detailed-billing/operations/dummy";
import { mtxcaAutorizar } from "./services/detailed-billing/operations/autorizar";
import { mtxcaUltimoAutorizado } from "./services/detailed-billing/operations/ultimo-autorizado";
import type { MtxcaDummyResult } from "./services/detailed-billing/operations/dummy";
import type { MtxcaAutorizarResult } from "./services/detailed-billing/operations/autorizar";
import type {
  MtxcaUltimoInput,
  MtxcaUltimoResult,
} from "./services/detailed-billing/operations/ultimo-autorizado";
import type { ComprobanteCAERequest } from "./services/detailed-billing/types/request";
import { cdcDummy } from "./services/verification/operations/dummy";
import { constatar } from "./services/verification/operations/constatar";
import type { CdcDummyResult } from "./services/verification/operations/dummy";
import type { CmpReq } from "./services/verification/types/request";
import type { ConstatarResult } from "./services/verification/types/response";
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

export const SDK_VERSION = "0.6.0" as const;

export type ServiceWsdlKey =
  | "wsfev1"
  | "wsfexv1"
  | "wsmtxca"
  | "wscdc"
  | "padronA4"
  | "padronA10"
  | "padronA13";

export type ServiceWsdls = Partial<Record<ServiceWsdlKey, string>>;

export async function fetchWsdls(environment: Environment): Promise<ServiceWsdls> {
  const eps = ENDPOINTS[environment];
  const keys: ServiceWsdlKey[] = [
    "wsfev1",
    "wsfexv1",
    "wsmtxca",
    "wscdc",
    "padronA4",
    "padronA10",
    "padronA13",
  ];
  const entries = await Promise.all(
    keys.map(async (key) => {
      const url = `${eps[key]}?WSDL`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch WSDL for ${key}: HTTP ${response.status}`);
      }
      return [key, await response.text()] as const;
    }),
  );
  return Object.fromEntries(entries) as ServiceWsdls;
}

export interface ArcaOptions {
  cuit: string;
  cert: string;
  key: string;
  environment: Environment;
  storage?: TicketStorage;
  clock?: NtpClock;
  logger?: Logger;
  wsdls?: ServiceWsdls;
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

export interface ExportBillingService {
  dummy(): Promise<FexDummyResult>;
  createInvoice(input: FexAuthorizeInput): Promise<FexAuthorizeResult>;
  lastAuthorized(input: FexLastCmpInput): Promise<FexLastCmpResult>;
  lastId(): Promise<{ Id: number }>;
  cotizacion(monId: string): Promise<FEXResultCotiz>;
}

export interface DetailedBillingService {
  dummy(): Promise<MtxcaDummyResult>;
  createInvoice(input: ComprobanteCAERequest): Promise<MtxcaAutorizarResult>;
  lastAuthorized(input: MtxcaUltimoInput): Promise<MtxcaUltimoResult>;
}

export interface VerificationService {
  dummy(): Promise<CdcDummyResult>;
  constatar(req: CmpReq): Promise<ConstatarResult>;
}

export class Arca {
  readonly electronicBilling: ElectronicBillingService;
  readonly register: RegisterService;
  readonly exportBilling: ExportBillingService;
  readonly detailedBilling: DetailedBillingService;
  readonly verification: VerificationService;

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
    const rawClients = new Map<ServiceWsdlKey, Promise<SoapClient>>();
    const getRaw = (serviceKey: ServiceWsdlKey): Promise<SoapClient> => {
      let p = rawClients.get(serviceKey);
      if (p) return p;
      const endpoint = endpoints[serviceKey];
      const inlineWsdl = opts.wsdls?.[serviceKey];
      p = createSoapClient({
        wsdl: inlineWsdl ?? { url: `${endpoint}?WSDL` },
        endpoint,
      });
      rawClients.set(serviceKey, p);
      return p;
    };

    let wsfeAuthed: SoapClient | null = null;
    const getAuthed = async (): Promise<SoapClient> => {
      if (wsfeAuthed) return wsfeAuthed;
      const raw = await getRaw("wsfev1");
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
      personaA4: async (cuit) => getPersonaA4(await getRaw("padronA4"), wsaa, cuit),
      personaA10: async (cuit) => getPersonaA10(await getRaw("padronA10"), wsaa, cuit),
      personaA13: async (cuit) => getPersonaA13(await getRaw("padronA13"), wsaa, cuit),
    };

    let fexAuthed: SoapClient | null = null;
    const getFexAuthed = async (): Promise<SoapClient> => {
      if (fexAuthed) return fexAuthed;
      const raw = await getRaw("wsfexv1");
      fexAuthed = withAuth({ soap: raw, wsaa, service: "wsfex" });
      return fexAuthed;
    };

    this.exportBilling = {
      dummy: async () => fexDummy(await getFexAuthed()),
      createInvoice: async (input) => fexAuthorize(await getFexAuthed(), input),
      lastAuthorized: async (input) => fexLastCmp(await getFexAuthed(), input),
      lastId: async () => fexLastId(await getFexAuthed()),
      cotizacion: async (monId) => fexCotizacion(await getFexAuthed(), monId),
    };

    let mtxcaAuthed: SoapClient | null = null;
    const getMtxcaAuthed = async (): Promise<SoapClient> => {
      if (mtxcaAuthed) return mtxcaAuthed;
      const raw = await getRaw("wsmtxca");
      mtxcaAuthed = withAuth({ soap: raw, wsaa, service: "wsmtxca" });
      return mtxcaAuthed;
    };

    this.detailedBilling = {
      dummy: async () => mtxcaDummy(await getMtxcaAuthed()),
      createInvoice: async (input) => mtxcaAutorizar(await getMtxcaAuthed(), input),
      lastAuthorized: async (input) => mtxcaUltimoAutorizado(await getMtxcaAuthed(), input),
    };

    let cdcAuthed: SoapClient | null = null;
    const getCdcAuthed = async (): Promise<SoapClient> => {
      if (cdcAuthed) return cdcAuthed;
      const raw = await getRaw("wscdc");
      cdcAuthed = withAuth({ soap: raw, wsaa, service: "wscdc" });
      return cdcAuthed;
    };

    this.verification = {
      dummy: async () => cdcDummy(await getCdcAuthed()),
      constatar: async (req) => constatar(await getCdcAuthed(), req),
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
  WsfexError,
  WsPadronError,
  WsMtxcaError,
  WsCdcError,
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
  WsfexErrorCode,
  WsfexErrorOptions,
  WsPadronErrorCode,
  WsPadronErrorOptions,
  WsMtxcaErrorCode,
  WsMtxcaErrorOptions,
  WsCdcErrorCode,
  WsCdcErrorOptions,
} from "./core/errors";

export type {
  Cmp,
  Item,
  Permiso,
  CmpAsoc,
  CbteTipoExport,
  TipoExpo,
  IdiomaCbte,
  PermisoExistente,
  FEXResultAuth,
  FEXResultGet,
  FEXResultID,
  FEXResultCotiz,
  FexErr,
  FexEvent,
  FexResultCode,
} from "./services/export-billing/types";
export type {
  FexAuthorizeInput,
  FexAuthorizeResult,
} from "./services/export-billing/operations/authorize";
export type {
  FexLastCmpInput,
  FexLastCmpResult,
} from "./services/export-billing/operations/last-cmp";
export type { FexDummyResult } from "./services/export-billing/operations/dummy";

export type {
  ComprobanteCAERequest,
  ItemDetalle,
  CuotaIva,
  SubtotalIVA,
  OtroTributo,
} from "./services/detailed-billing/types/request";
export type {
  ComprobanteCAEResponse,
  MtxcaApiError,
  MtxcaEvento,
} from "./services/detailed-billing/types/response";
export type { MtxcaDummyResult } from "./services/detailed-billing/operations/dummy";
export type { MtxcaAutorizarResult } from "./services/detailed-billing/operations/autorizar";
export type {
  MtxcaUltimoInput,
  MtxcaUltimoResult,
} from "./services/detailed-billing/operations/ultimo-autorizado";

export type { CmpReq } from "./services/verification/types/request";
export type {
  ConstatarResult,
  CdcResultado,
  CdcEvento,
  CdcObservacion,
  CdcApiError,
} from "./services/verification/types/response";
export type { CdcDummyResult } from "./services/verification/operations/dummy";

export type {
  PersonaReturn,
  Domicilio,
  Actividad,
  Impuesto,
  CategoriaMonotributo,
  TipoPersona,
} from "./services/register/types/persona";
