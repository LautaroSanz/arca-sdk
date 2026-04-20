import type { CbteTipo, Concepto, DocTipo, IvaId, Moneda, TributoId } from "./ids";

export interface FeCabRequest {
  CantReg: number;
  PtoVta: number;
  CbteTipo: CbteTipo;
}

export interface AlicIva {
  Id: IvaId;
  BaseImp: number;
  Importe: number;
}

export interface Tributo {
  Id: TributoId;
  Desc?: string;
  BaseImp: number;
  Alic: number;
  Importe: number;
}

export interface Opcional {
  Id: string;
  Valor: string;
}

export interface CbteAsoc {
  Tipo: CbteTipo;
  PtoVta: number;
  Nro: number;
  Cuit?: string;
  CbteFch?: string;
}

export interface Comprador {
  DocTipo: DocTipo;
  DocNro: string;
  Porcentaje: number;
}

export interface Actividad {
  Id: number;
}

export interface PeriodoAsoc {
  FchDesde: string;
  FchHasta: string;
}

export interface FECAEDetRequest {
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
  CbtesAsoc?: { CbteAsoc: CbteAsoc[] };
  Tributos?: { Tributo: Tributo[] };
  Iva?: { AlicIva: AlicIva[] };
  Opcionales?: { Opcional: Opcional[] };
  Compradores?: { Comprador: Comprador[] };
  Actividades?: { Actividad: Actividad[] };
  PeriodoAsoc?: PeriodoAsoc;
}
