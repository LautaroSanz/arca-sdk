export interface FexErr {
  ErrCode: string | number;
  ErrMsg: string;
}

export interface FexEvent {
  EventCode: string | number;
  EventMsg: string;
}

export type FexResultCode = "A" | "R";

export interface FEXResultAuth {
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

export interface FEXResultGet {
  Cbte_tipo: number;
  Punto_vta: number;
  Cbte_nro: number;
}

export interface FEXResultID {
  Id: number;
}

export interface FEXResultCotiz {
  Mon_id: string;
  Mon_ctz: number;
  Fch_cotiz: string;
}
