type Environment = "testing" | "production";
interface ServiceEndpoints {
    wsaa: string;
    wsfev1: string;
    wsfexv1: string;
    wsmtxca: string;
    wscdc: string;
    padronA4: string;
    padronA10: string;
    padronA13: string;
    ntp: string;
}
declare const ENDPOINTS: {
    readonly testing: {
        readonly wsaa: "https://wsaahomo.afip.gov.ar/ws/services/LoginCms";
        readonly wsfev1: "https://wswhomo.afip.gov.ar/wsfev1/service.asmx";
        readonly wsfexv1: "https://wswhomo.afip.gov.ar/wsfexv1/service.asmx";
        readonly wsmtxca: "https://fwshomo.afip.gov.ar/wsmtxca/services/MTXCAService";
        readonly wscdc: "https://wswhomo.afip.gov.ar/WSCDC/service.asmx";
        readonly padronA4: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA4";
        readonly padronA10: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA10";
        readonly padronA13: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA13";
        readonly ntp: "time.afip.gov.ar";
    };
    readonly production: {
        readonly wsaa: "https://wsaa.afip.gov.ar/ws/services/LoginCms";
        readonly wsfev1: "https://servicios1.afip.gov.ar/wsfev1/service.asmx";
        readonly wsfexv1: "https://servicios1.afip.gov.ar/wsfexv1/service.asmx";
        readonly wsmtxca: "https://serviciosjava.afip.gob.ar/wsmtxca/services/MTXCAService";
        readonly wscdc: "https://servicios1.afip.gov.ar/WSCDC/service.asmx";
        readonly padronA4: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA4";
        readonly padronA10: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA10";
        readonly padronA13: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA13";
        readonly ntp: "time.afip.gov.ar";
    };
};

type TipoPersona = "FISICA" | "JURIDICA";
interface Domicilio {
    codigoPostal?: string;
    tipoDomicilio?: string;
    direccion?: string;
    localidad?: string;
    idProvincia?: number;
    descripcionProvincia?: string;
}
interface Actividad$2 {
    idActividad: number;
    descripcionActividad?: string;
    nomenclador?: number;
    periodo?: number;
    orden?: number;
}
interface Impuesto {
    idImpuesto: number;
    descripcionImpuesto?: string;
    periodo?: number;
    estado?: string;
}
interface CategoriaMonotributo {
    idImpuesto?: number;
    descripcionCategoria?: string;
    periodo?: number;
    estado?: string;
}
interface PersonaReturn {
    idPersona: number;
    tipoPersona: TipoPersona;
    tipoClave: string;
    estadoClave: string;
    nombre?: string;
    apellido?: string;
    razonSocial?: string;
    fechaInscripcion?: string;
    fechaNacimiento?: string;
    fechaFallecimiento?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    domicilio?: Domicilio[];
    actividad?: Actividad$2[];
    impuesto?: Impuesto[];
    categoriasMonotributo?: CategoriaMonotributo[];
}

declare const CbteTipoExport: {
    readonly FacturaE: 19;
    readonly NotaDebitoE: 20;
    readonly NotaCreditoE: 21;
};
type CbteTipoExport = (typeof CbteTipoExport)[keyof typeof CbteTipoExport];
declare const TipoExpo: {
    readonly ExportacionBienes: 1;
    readonly ServiciosExterior: 2;
    readonly OtrosExportacion: 4;
};
type TipoExpo = (typeof TipoExpo)[keyof typeof TipoExpo];
declare const IdiomaCbte: {
    readonly Espanol: 1;
    readonly Ingles: 2;
    readonly Portugues: 3;
};
type IdiomaCbte = (typeof IdiomaCbte)[keyof typeof IdiomaCbte];
type PermisoExistente = "S" | "N" | "";

interface Item {
    Pro_codigo?: string;
    Pro_ds: string;
    Pro_qty?: number;
    Pro_umed?: number;
    Pro_precio_uni?: number;
    Pro_total_item: number;
}
interface Permiso {
    Id_permiso: string;
    Dst_merc: number;
}
interface CmpAsoc {
    Cbte_tipo: number;
    Cbte_punto_vta: number;
    Cbte_nro: number;
    Cbte_cuit: string;
}
interface Actividad$1 {
    Id: number;
}
interface Cmp {
    Id: number;
    Fecha_cbte: string;
    Cbte_Tipo: CbteTipoExport;
    Punto_vta: number;
    Cbte_nro: number;
    Tipo_expo: TipoExpo;
    Permiso_existente: PermisoExistente;
    Dst_cmp: number;
    Cliente: string;
    Cuit_pais_cliente: string;
    Domicilio_cliente: string;
    Id_impositivo?: string;
    Moneda_Id: string;
    Moneda_ctz: number;
    Obs_comerciales?: string;
    Imp_total: number;
    Obs?: string;
    Forma_pago?: string;
    Incoterms?: string;
    Incoterms_Ds?: string;
    Idioma_cbte: IdiomaCbte;
    Fecha_pago?: string;
    Items: {
        Item: Item[];
    };
    Permisos?: {
        Permiso: Permiso[];
    };
    Cmps_asoc?: {
        Cmp_asoc: CmpAsoc[];
    };
    Actividades_id?: {
        Actividad_id: Actividad$1[];
    };
}

interface FexErr {
    ErrCode: string | number;
    ErrMsg: string;
}
interface FexEvent {
    EventCode: string | number;
    EventMsg: string;
}
type FexResultCode = "A" | "R";
interface FEXResultAuth {
    Cuit: string;
    Id: number;
    Fecha_cbte: string;
    Cbte_tipo: number;
    Punto_vta: number;
    Cbte_nro: number;
    Reproceso: "N" | "S";
    Cae: string;
    Fch_venc_Cae: string;
    Resultado: FexResultCode;
    Motivos_Obs?: string;
}
interface FEXResultGet {
    Cbte_tipo: number;
    Punto_vta: number;
    Cbte_nro: number;
}
interface FEXResultID {
    Id: number;
}
interface FEXResultCotiz {
    Mon_id: string;
    Mon_ctz: number;
    Fch_cotiz: string;
}

interface FexAuthorizeInput {
    Id: number;
    Cmp: Cmp;
}
interface FexAuthorizeResult {
    FEXResultAuth: FEXResultAuth;
    FEXEvents: FexEvent[];
    raw: unknown;
}

interface FexLastCmpInput {
    Cbte_Tipo: number;
    Pto_venta: number;
}
interface FexLastCmpResult {
    Cbte_tipo: number;
    Punto_vta: number;
    Cbte_nro: number;
}

interface FexDummyResult {
    AppServer: "OK" | "NO";
    DbServer: "OK" | "NO";
    AuthServer: "OK" | "NO";
}

interface MtxcaDummyResult {
    appserver: "OK" | "NO";
    dbserver: "OK" | "NO";
    authserver: "OK" | "NO";
}

interface ItemDetalle {
    unidadesMtx: number;
    codigoMtx?: string;
    codigo?: string;
    descripcion: string;
    cantidad: number;
    codigoUnidadMedida: number;
    precioUnitario: number;
    importeBonificacion?: number;
    codigoCondicionIVA: number;
    importeIVA?: number;
    importeItem: number;
}
interface CuotaIva {
    codigo: number;
    importe: number;
}
interface SubtotalIVA {
    codigo: number;
    importe: number;
}
interface OtroTributo {
    codigo: number;
    descripcion?: string;
    baseImponible: number;
    alicuota?: number;
    importe: number;
}
interface ComprobanteCAERequest {
    codigoTipoComprobante: number;
    numeroPuntoVenta: number;
    numeroComprobante: number;
    fechaEmision: string;
    codigoTipoDocumento: number;
    numeroDocumento: string;
    importeGravado: number;
    importeNoGravado: number;
    importeExento: number;
    importeSubtotal: number;
    importeOtrosTributos?: number;
    importeTotal: number;
    codigoMoneda: string;
    cotizacionMoneda: number;
    observaciones?: string;
    codigoConcepto: number;
    fechaServicioDesde?: string;
    fechaServicioHasta?: string;
    fechaVencimientoPago?: string;
    arrayItems: {
        item: ItemDetalle[];
    };
    arraySubtotalesIVA?: {
        subtotalIVA: SubtotalIVA[];
    };
    arrayOtrosTributos?: {
        otroTributo: OtroTributo[];
    };
    arrayComprobantesAsociados?: {
        comprobanteAsociado: Array<{
            codigoTipoComprobante: number;
            numeroPuntoVenta: number;
            numeroComprobante: number;
        }>;
    };
}

interface MtxcaApiError {
    codigoDescripcion?: {
        codigo: string | number;
        descripcion?: string;
    };
    codigo?: string | number;
    descripcion?: string;
}
interface MtxcaEvento {
    codigo: string | number;
    descripcion: string;
}
interface ComprobanteCAEResponse {
    CAE: string;
    fechaVencimientoCAE: string;
    fechaProceso?: string;
    codigoTipoComprobante: number;
    numeroPuntoVenta: number;
    numeroComprobante: number;
    fechaEmision: string;
    cuitEmisor?: string;
}

interface MtxcaAutorizarResult {
    comprobanteResponse: ComprobanteCAEResponse;
    eventos: MtxcaEvento[];
    raw: unknown;
}

interface MtxcaUltimoInput {
    codigoTipoComprobante: number;
    numeroPuntoVenta: number;
}
interface MtxcaUltimoResult {
    codigoTipoComprobante: number;
    numeroPuntoVenta: number;
    numeroComprobante: number;
}

interface CdcDummyResult {
    AppServer: "OK" | "NO";
    DbServer: "OK" | "NO";
    AuthServer: "OK" | "NO";
}

interface CmpReq {
    CbteModo: "CAE" | "CAEA";
    CuitEmisor: number | string;
    PtoVta: number;
    CbteTipo: number;
    CbteNro: number;
    CbteFch: string;
    ImpTotal: number;
    CodAutorizacion: string;
    DocTipoReceptor: number;
    DocNroReceptor: number | string;
}

type CdcResultado = "A" | "R" | "O";
interface CdcEvento {
    Code: number;
    Msg: string;
}
interface CdcObservacion {
    Code: number;
    Msg: string;
}
interface CdcApiError {
    Code: number;
    Msg: string;
}
interface ConstatarResult {
    Cuit?: string;
    Cuit_cdc?: string;
    FchProceso?: string;
    Resultado: CdcResultado;
    Events: CdcEvento[];
    Observaciones: CdcObservacion[];
}

/** Tipo de comprobante. Catalogo dinamico en ARCA; constantes aqui cubren los mas usados. */
declare const CbteTipo: {
    readonly FacturaA: 1;
    readonly NotaDebitoA: 2;
    readonly NotaCreditoA: 3;
    readonly ReciboA: 4;
    readonly FacturaB: 6;
    readonly NotaDebitoB: 7;
    readonly NotaCreditoB: 8;
    readonly ReciboB: 9;
    readonly FacturaC: 11;
    readonly NotaDebitoC: 12;
    readonly NotaCreditoC: 13;
    readonly ReciboC: 15;
    readonly FacturaMiPymeA: 201;
    readonly NotaDebitoMiPymeA: 202;
    readonly NotaCreditoMiPymeA: 203;
    readonly FacturaMiPymeB: 206;
    readonly NotaDebitoMiPymeB: 207;
    readonly NotaCreditoMiPymeB: 208;
    readonly FacturaMiPymeC: 211;
    readonly NotaDebitoMiPymeC: 212;
    readonly NotaCreditoMiPymeC: 213;
};
type CbteTipo = (typeof CbteTipo)[keyof typeof CbteTipo] | number;
/** Concepto del comprobante. */
declare const Concepto: {
    readonly Productos: 1;
    readonly Servicios: 2;
    readonly ProductosYServicios: 3;
};
type Concepto = (typeof Concepto)[keyof typeof Concepto];
/** Tipo de documento del receptor. */
declare const DocTipo: {
    readonly CUIT: 80;
    readonly CUIL: 86;
    readonly CDI: 87;
    readonly DNI: 96;
    readonly ConsumidorFinal: 99;
    readonly Pasaporte: 94;
};
type DocTipo = (typeof DocTipo)[keyof typeof DocTipo] | number;
/** Id de alicuota de IVA. */
declare const IvaId: {
    readonly NoGravado: 1;
    readonly Exento: 2;
    readonly Cero: 3;
    readonly IVA10_5: 4;
    readonly IVA21: 5;
    readonly IVA27: 6;
    readonly IVA5: 8;
    readonly IVA2_5: 9;
};
type IvaId = (typeof IvaId)[keyof typeof IvaId];
/** Id de tributo adicional. */
declare const TributoId: {
    readonly ImpuestosNacionales: 1;
    readonly ImpuestosProvinciales: 2;
    readonly ImpuestosMunicipales: 3;
    readonly ImpuestosInternos: 4;
    readonly Otro: 99;
};
type TributoId = (typeof TributoId)[keyof typeof TributoId] | number;
/** Codigo de moneda (catalogo dinamico de ARCA). Ej: PES (pesos), DOL (dolares). */
type Moneda = string;

interface FeCabRequest {
    CantReg: number;
    PtoVta: number;
    CbteTipo: CbteTipo;
}
interface AlicIva {
    Id: IvaId;
    BaseImp: number;
    Importe: number;
}
interface Tributo {
    Id: TributoId;
    Desc?: string;
    BaseImp: number;
    Alic: number;
    Importe: number;
}
interface Opcional {
    Id: string;
    Valor: string;
}
interface CbteAsoc {
    Tipo: CbteTipo;
    PtoVta: number;
    Nro: number;
    Cuit?: string;
    CbteFch?: string;
}
interface Comprador {
    DocTipo: DocTipo;
    DocNro: string;
    Porcentaje: number;
}
interface Actividad {
    Id: number;
}
interface PeriodoAsoc {
    FchDesde: string;
    FchHasta: string;
}
interface FECAEDetRequest {
    Concepto: Concepto;
    DocTipo: DocTipo;
    DocNro: number | string;
    CbteDesde: number;
    CbteHasta: number;
    CbteFch: string;
    ImpTotal: number;
    ImpTotConc: number;
    ImpNeto: number;
    ImpOpEx: number;
    ImpTrib: number;
    ImpIVA: number;
    FchServDesde?: string;
    FchServHasta?: string;
    FchVtoPago?: string;
    MonId: Moneda;
    MonCotiz: number;
    CanMisMonExt?: "S" | "N";
    CondicionIVAReceptorId?: number;
    CbtesAsoc?: {
        CbteAsoc: CbteAsoc[];
    };
    Tributos?: {
        Tributo: Tributo[];
    };
    Iva?: {
        AlicIva: AlicIva[];
    };
    Opcionales?: {
        Opcional: Opcional[];
    };
    Compradores?: {
        Comprador: Comprador[];
    };
    Actividades?: {
        Actividad: Actividad[];
    };
    PeriodoAsoc?: PeriodoAsoc;
}

interface Evento {
    Code: number;
    Msg: string;
}
interface Observacion {
    Code: number;
    Msg: string;
}
interface ArcaApiError {
    Code: number;
    Msg: string;
}
type ResultCode = "A" | "R" | "P";
interface FeCabResponse {
    CantReg: number;
    PtoVta: number;
    CbteTipo: CbteTipo;
    Result: ResultCode;
    Cuit: string;
    FchProceso: string;
    Reproceso: "N" | "S";
}
interface FECAEDetResponse {
    Concepto: Concepto;
    DocTipo: DocTipo;
    DocNro: number | string;
    CbteDesde: number;
    CbteHasta: number;
    CbteFch: string;
    Resultado: ResultCode;
    CAE?: string;
    CAEFchVto?: string;
    Observaciones?: Observacion[];
    Errores?: ArcaApiError[];
}

interface ArcaErrorOptions {
    message: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare abstract class ArcaError extends Error {
    abstract readonly code: string;
    readonly cause?: unknown;
    readonly context?: Record<string, unknown>;
    constructor(opts: ArcaErrorOptions);
    toJSON(): object;
}

declare abstract class WsnError extends ArcaError {
}
type WsfeErrorCode = `WSFE.${string}`;
interface WsfeErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class WsfeError extends WsnError {
    readonly code: WsfeErrorCode;
    constructor(code: WsfeErrorCode, opts?: WsfeErrorOptions);
}
type WsfexErrorCode = `WSFEX.${string}`;
interface WsfexErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class WsfexError extends WsnError {
    readonly code: WsfexErrorCode;
    constructor(code: WsfexErrorCode, opts?: WsfexErrorOptions);
}
type WsPadronErrorCode = `PADRON.${string}`;
interface WsPadronErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class WsPadronError extends WsnError {
    readonly code: WsPadronErrorCode;
    constructor(code: WsPadronErrorCode, opts?: WsPadronErrorOptions);
}
type WsMtxcaErrorCode = `MTXCA.${string}`;
interface WsMtxcaErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class WsMtxcaError extends WsnError {
    readonly code: WsMtxcaErrorCode;
    constructor(code: WsMtxcaErrorCode, opts?: WsMtxcaErrorOptions);
}
type WsCdcErrorCode = `CDC.${string}`;
interface WsCdcErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class WsCdcError extends WsnError {
    readonly code: WsCdcErrorCode;
    constructor(code: WsCdcErrorCode, opts?: WsCdcErrorOptions);
}

interface FeCaeSolicitarInput {
    FeCabReq: FeCabRequest;
    FeDetReq: FECAEDetRequest[];
}
interface FeCaeSolicitarResult {
    FeCabResp: FeCabResponse;
    FeDetResp: FECAEDetResponse[];
    Events: Evento[];
    raw: unknown;
}
interface DuplicateInvoiceErrorOptions {
    message?: string;
    cause?: unknown;
    existingCae?: string;
    cbteNro?: number;
    context?: Record<string, unknown>;
}
declare class DuplicateInvoiceError extends WsfeError {
    readonly existingCae?: string;
    readonly cbteNro?: number;
    constructor(opts?: DuplicateInvoiceErrorOptions);
}

interface UltimoAutorizadoInput {
    PtoVta: number;
    CbteTipo: CbteTipo;
}
interface UltimoAutorizadoResult {
    PtoVta: number;
    CbteTipo: CbteTipo;
    CbteNro: number;
    Events: Evento[];
}

interface DummyResult {
    AppServer: "OK" | "NO";
    DbServer: "OK" | "NO";
    AuthServer: "OK" | "NO";
}

interface TipoCatalogo {
    Id: number;
    Desc: string;
    FchDesde: string;
    FchHasta: string;
}
type TipoCbte = TipoCatalogo;
type TipoConcepto = TipoCatalogo;
type TipoDoc = TipoCatalogo;
type TipoIva = TipoCatalogo;
type TipoTributo = TipoCatalogo;
type TipoOpcional = {
    Id: string;
    Desc: string;
    FchDesde: string;
    FchHasta: string;
};
interface TipoMoneda {
    Id: string;
    Desc: string;
    FchDesde: string;
    FchHasta: string;
}
interface PtoVenta {
    Nro: number;
    EmisionTipo: string;
    Bloqueado: "S" | "N";
    FchBaja?: string;
}
interface Cotizacion {
    MonId: string;
    MonCotiz: number;
    FchCotiz: string;
}

interface AccessTicket {
    service: string;
    cuit: string;
    token: string;
    sign: string;
    generationTime: Date;
    expirationTime: Date;
    raw: string;
}
declare function isExpired(ticket: AccessTicket, now?: Date): boolean;
declare function isAboutToExpire(ticket: AccessTicket, marginSeconds: number, now?: Date): boolean;

interface TicketStorage {
    get(service: string, cuit: string): Promise<AccessTicket | null>;
    set(ticket: AccessTicket): Promise<void>;
    delete(service: string, cuit: string): Promise<void>;
}

interface Logger {
    debug(msg: string, meta?: Record<string, unknown>): void;
    info(msg: string, meta?: Record<string, unknown>): void;
    warn(msg: string, meta?: Record<string, unknown>): void;
    error(msg: string, meta?: Record<string, unknown>): void;
}
type LogLevel = "debug" | "info" | "warn" | "error";
declare const noopLogger: Logger;
declare function consoleLogger(level?: LogLevel): Logger;

interface NtpClock {
    now(): Promise<Date>;
}
interface NtpClockOptions {
    server?: string;
    logger?: Logger;
    cacheTtlSeconds?: number;
}
declare function createSystemClock(): NtpClock;
declare function createNtpClock(options?: NtpClockOptions): NtpClock;

declare class MemoryTicketStorage implements TicketStorage {
    private readonly cache;
    private key;
    get(service: string, cuit: string): Promise<AccessTicket | null>;
    set(ticket: AccessTicket): Promise<void>;
    delete(service: string, cuit: string): Promise<void>;
}

interface FsStorageOptions {
    dir: string;
    fileMode?: number;
    logger?: Logger;
}
declare class FsTicketStorage implements TicketStorage {
    private readonly dir;
    private readonly fileMode;
    private readonly logger;
    constructor(opts: FsStorageOptions);
    private filePath;
    private serialize;
    private deserialize;
    get(service: string, cuit: string): Promise<AccessTicket | null>;
    set(ticket: AccessTicket): Promise<void>;
    delete(service: string, cuit: string): Promise<void>;
}

type ConfigErrorCode = `CONFIG.${string}`;
interface ConfigErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class ConfigError extends ArcaError {
    readonly code: ConfigErrorCode;
    constructor(code: ConfigErrorCode, opts?: ConfigErrorOptions);
}

type CryptoErrorCode = `CRYPTO.${string}`;
interface CryptoErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class CryptoError extends ArcaError {
    readonly code: CryptoErrorCode;
    constructor(code: CryptoErrorCode, opts?: CryptoErrorOptions);
}

type WsaaErrorCode = `WSAA.${string}`;
interface WsaaErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
    arcaCode?: string;
}
declare class WsaaError extends ArcaError {
    readonly code: WsaaErrorCode;
    readonly arcaCode?: string;
    constructor(code: WsaaErrorCode, opts?: WsaaErrorOptions);
    toJSON(): object;
}

type SoapErrorCode = `SOAP.${string}`;
interface SoapErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class SoapError extends ArcaError {
    readonly code: SoapErrorCode;
    constructor(code: SoapErrorCode, opts?: SoapErrorOptions);
}

interface TimeSkewErrorOptions {
    message?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
declare class TimeSkewError extends ArcaError {
    readonly code: "TIME.SKEW";
    constructor(opts?: TimeSkewErrorOptions);
}

declare function isRetryable(err: unknown): boolean;

declare const SDK_VERSION: "0.6.0";
type ServiceWsdlKey = "wsfev1" | "wsfexv1" | "wsmtxca" | "wscdc" | "padronA4" | "padronA10" | "padronA13";
type ServiceWsdls = Partial<Record<ServiceWsdlKey, string>>;
declare function fetchWsdls(environment: Environment): Promise<ServiceWsdls>;
interface ArcaOptions {
    cuit: string;
    cert: string;
    key: string;
    environment: Environment;
    storage?: TicketStorage;
    clock?: NtpClock;
    logger?: Logger;
    wsdls?: ServiceWsdls;
}
interface ElectronicBillingParams {
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
interface ElectronicBillingService {
    dummy(): Promise<DummyResult>;
    createInvoice(input: FeCaeSolicitarInput): Promise<FeCaeSolicitarResult>;
    lastAuthorized(input: UltimoAutorizadoInput): Promise<UltimoAutorizadoResult>;
    params: ElectronicBillingParams;
}
interface RegisterService {
    personaA4(cuit: number | string): Promise<PersonaReturn>;
    personaA10(cuit: number | string): Promise<PersonaReturn>;
    personaA13(cuit: number | string): Promise<PersonaReturn>;
}
interface ExportBillingService {
    dummy(): Promise<FexDummyResult>;
    createInvoice(input: FexAuthorizeInput): Promise<FexAuthorizeResult>;
    lastAuthorized(input: FexLastCmpInput): Promise<FexLastCmpResult>;
    lastId(): Promise<{
        Id: number;
    }>;
    cotizacion(monId: string): Promise<FEXResultCotiz>;
}
interface DetailedBillingService {
    dummy(): Promise<MtxcaDummyResult>;
    createInvoice(input: ComprobanteCAERequest): Promise<MtxcaAutorizarResult>;
    lastAuthorized(input: MtxcaUltimoInput): Promise<MtxcaUltimoResult>;
}
interface VerificationService {
    dummy(): Promise<CdcDummyResult>;
    constatar(req: CmpReq): Promise<ConstatarResult>;
}
declare class Arca {
    readonly electronicBilling: ElectronicBillingService;
    readonly register: RegisterService;
    readonly exportBilling: ExportBillingService;
    readonly detailedBilling: DetailedBillingService;
    readonly verification: VerificationService;
    constructor(opts: ArcaOptions);
}

export { type AccessTicket, type Actividad$2 as Actividad, type AlicIva, Arca, type ArcaApiError, ArcaError, type ArcaErrorOptions, type ArcaOptions, type CategoriaMonotributo, type CbteAsoc, CbteTipo, CbteTipoExport, type CdcApiError, type CdcDummyResult, type CdcEvento, type CdcObservacion, type CdcResultado, type Cmp, type CmpAsoc, type CmpReq, type Comprador, type ComprobanteCAERequest, type ComprobanteCAEResponse, Concepto, ConfigError, type ConfigErrorCode, type ConstatarResult, type Cotizacion, CryptoError, type CryptoErrorCode, type CuotaIva, type DetailedBillingService, DocTipo, type Domicilio, type DummyResult, DuplicateInvoiceError, type DuplicateInvoiceErrorOptions, ENDPOINTS, type ElectronicBillingParams, type ElectronicBillingService, type Environment, type Evento, type ExportBillingService, type FECAEDetRequest, type FECAEDetResponse, type FEXResultAuth, type FEXResultCotiz, type FEXResultGet, type FEXResultID, type FeCabRequest, type FeCabResponse, type FeCaeSolicitarInput, type FeCaeSolicitarResult, type FexAuthorizeInput, type FexAuthorizeResult, type FexDummyResult, type FexErr, type FexEvent, type FexLastCmpInput, type FexLastCmpResult, type FexResultCode, type FsStorageOptions, FsTicketStorage, IdiomaCbte, type Impuesto, type Item, type ItemDetalle, IvaId, type LogLevel, type Logger, MemoryTicketStorage, type Moneda, type MtxcaApiError, type MtxcaAutorizarResult, type MtxcaDummyResult, type MtxcaEvento, type MtxcaUltimoInput, type MtxcaUltimoResult, type NtpClock, type NtpClockOptions, type Observacion, type Opcional, type OtroTributo, type PeriodoAsoc, type Permiso, type PermisoExistente, type PersonaReturn, type PtoVenta, type RegisterService, type ResultCode, SDK_VERSION, type ServiceEndpoints, type ServiceWsdlKey, type ServiceWsdls, SoapError, type SoapErrorCode, type SubtotalIVA, type TicketStorage, TimeSkewError, type TipoCatalogo, type TipoCbte, type TipoConcepto, type TipoDoc, TipoExpo, type TipoIva, type TipoMoneda, type TipoOpcional, type TipoPersona, type TipoTributo, type Tributo, TributoId, type UltimoAutorizadoInput, type UltimoAutorizadoResult, type VerificationService, WsCdcError, type WsCdcErrorCode, type WsCdcErrorOptions, WsMtxcaError, type WsMtxcaErrorCode, type WsMtxcaErrorOptions, WsPadronError, type WsPadronErrorCode, type WsPadronErrorOptions, WsaaError, type WsaaErrorCode, type WsaaErrorOptions, WsfeError, type WsfeErrorCode, WsfexError, type WsfexErrorCode, type WsfexErrorOptions, WsnError, consoleLogger, createNtpClock, createSystemClock, fetchWsdls, isAboutToExpire, isExpired, isRetryable, noopLogger };
