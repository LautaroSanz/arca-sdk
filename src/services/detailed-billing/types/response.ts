export interface MtxcaApiError {
  codigoDescripcion?: {
    codigo: string | number;
    descripcion?: string;
  };
  codigo?: string | number;
  descripcion?: string;
}

export interface MtxcaEvento {
  codigo: string | number;
  descripcion: string;
}

export interface ComprobanteCAEResponse {
  CAE: string;
  fechaVencimientoCAE: string;
  fechaProceso?: string;
  codigoTipoComprobante: number;
  numeroPuntoVenta: number;
  numeroComprobante: number;
  fechaEmision: string;
  cuitEmisor?: string;
}
