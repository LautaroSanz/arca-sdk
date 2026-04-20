export type CdcResultado = "A" | "R" | "O";

export interface CdcEvento {
  Code: number;
  Msg: string;
}

export interface CdcObservacion {
  Code: number;
  Msg: string;
}

export interface CdcApiError {
  Code: number;
  Msg: string;
}

export interface ConstatarResult {
  Cuit?: string;
  Cuit_cdc?: string;
  FchProceso?: string;
  Resultado: CdcResultado;
  Events: CdcEvento[];
  Observaciones: CdcObservacion[];
}
