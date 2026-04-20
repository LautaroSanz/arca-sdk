export interface CmpReq {
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
