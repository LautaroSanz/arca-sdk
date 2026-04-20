/** Tipo de comprobante. Catalogo dinamico en ARCA; constantes aqui cubren los mas usados. */
export const CbteTipo = {
  FacturaA: 1,
  NotaDebitoA: 2,
  NotaCreditoA: 3,
  ReciboA: 4,
  FacturaB: 6,
  NotaDebitoB: 7,
  NotaCreditoB: 8,
  ReciboB: 9,
  FacturaC: 11,
  NotaDebitoC: 12,
  NotaCreditoC: 13,
  ReciboC: 15,
  FacturaMiPymeA: 201,
  NotaDebitoMiPymeA: 202,
  NotaCreditoMiPymeA: 203,
  FacturaMiPymeB: 206,
  NotaDebitoMiPymeB: 207,
  NotaCreditoMiPymeB: 208,
  FacturaMiPymeC: 211,
  NotaDebitoMiPymeC: 212,
  NotaCreditoMiPymeC: 213,
} as const;
export type CbteTipo = (typeof CbteTipo)[keyof typeof CbteTipo] | number;

/** Concepto del comprobante. */
export const Concepto = {
  Productos: 1,
  Servicios: 2,
  ProductosYServicios: 3,
} as const;
export type Concepto = (typeof Concepto)[keyof typeof Concepto];

/** Tipo de documento del receptor. */
export const DocTipo = {
  CUIT: 80,
  CUIL: 86,
  CDI: 87,
  DNI: 96,
  ConsumidorFinal: 99,
  Pasaporte: 94,
} as const;
export type DocTipo = (typeof DocTipo)[keyof typeof DocTipo] | number;

/** Id de alicuota de IVA. */
export const IvaId = {
  NoGravado: 1,
  Exento: 2,
  Cero: 3,
  IVA10_5: 4,
  IVA21: 5,
  IVA27: 6,
  IVA5: 8,
  IVA2_5: 9,
} as const;
export type IvaId = (typeof IvaId)[keyof typeof IvaId];

/** Id de tributo adicional. */
export const TributoId = {
  ImpuestosNacionales: 1,
  ImpuestosProvinciales: 2,
  ImpuestosMunicipales: 3,
  ImpuestosInternos: 4,
  Otro: 99,
} as const;
export type TributoId = (typeof TributoId)[keyof typeof TributoId] | number;

/** Codigo de moneda (catalogo dinamico de ARCA). Ej: PES (pesos), DOL (dolares). */
export type Moneda = string;
