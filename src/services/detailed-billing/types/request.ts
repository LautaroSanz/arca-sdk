export interface ItemDetalle {
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

export interface CuotaIva {
  codigo: number;
  importe: number;
}

export interface SubtotalIVA {
  codigo: number;
  importe: number;
}

export interface OtroTributo {
  codigo: number;
  descripcion?: string;
  baseImponible: number;
  alicuota?: number;
  importe: number;
}

export interface ComprobanteCAERequest {
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
  arrayItems: { item: ItemDetalle[] };
  arraySubtotalesIVA?: { subtotalIVA: SubtotalIVA[] };
  arrayOtrosTributos?: { otroTributo: OtroTributo[] };
  arrayComprobantesAsociados?: {
    comprobanteAsociado: Array<{
      codigoTipoComprobante: number;
      numeroPuntoVenta: number;
      numeroComprobante: number;
    }>;
  };
}
