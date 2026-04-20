import type { CbteTipo, Concepto, DocTipo } from "./ids";

export interface Evento {
  Code: number;
  Msg: string;
}

export interface Observacion {
  Code: number;
  Msg: string;
}

export interface ArcaApiError {
  Code: number;
  Msg: string;
}

export type ResultCode = "A" | "R" | "P";

export interface FeCabResponse {
  CantReg: number;
  PtoVta: number;
  CbteTipo: CbteTipo;
  Result: ResultCode;
  Cuit: string;
  FchProceso: string;
  Reproceso: "N" | "S";
}

export interface FECAEDetResponse {
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
