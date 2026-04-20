export const CbteTipoExport = {
  FacturaE: 19,
  NotaDebitoE: 20,
  NotaCreditoE: 21,
} as const;
export type CbteTipoExport = (typeof CbteTipoExport)[keyof typeof CbteTipoExport];

export const TipoExpo = {
  ExportacionBienes: 1,
  ServiciosExterior: 2,
  OtrosExportacion: 4,
} as const;
export type TipoExpo = (typeof TipoExpo)[keyof typeof TipoExpo];

export const IdiomaCbte = {
  Espanol: 1,
  Ingles: 2,
  Portugues: 3,
} as const;
export type IdiomaCbte = (typeof IdiomaCbte)[keyof typeof IdiomaCbte];

export type PermisoExistente = "S" | "N" | "";
