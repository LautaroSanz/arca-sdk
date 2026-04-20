export interface TipoCatalogo {
  Id: number;
  Desc: string;
  FchDesde: string;
  FchHasta: string;
}

export type TipoCbte = TipoCatalogo;
export type TipoConcepto = TipoCatalogo;
export type TipoDoc = TipoCatalogo;
export type TipoIva = TipoCatalogo;
export type TipoTributo = TipoCatalogo;
export type TipoOpcional = { Id: string; Desc: string; FchDesde: string; FchHasta: string };

export interface TipoMoneda {
  Id: string;
  Desc: string;
  FchDesde: string;
  FchHasta: string;
}

export interface PtoVenta {
  Nro: number;
  EmisionTipo: string;
  Bloqueado: "S" | "N";
  FchBaja?: string;
}

export interface Cotizacion {
  MonId: string;
  MonCotiz: number;
  FchCotiz: string;
}
