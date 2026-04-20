import type { CbteTipoExport, TipoExpo, IdiomaCbte, PermisoExistente } from "./ids";

export interface Item {
  Pro_codigo?: string;
  Pro_ds: string;
  Pro_qty?: number;
  Pro_umed?: number;
  Pro_precio_uni?: number;
  Pro_total_item: number;
}

export interface Permiso {
  Id_permiso: string;
  Dst_merc: number;
}

export interface CmpAsoc {
  Cbte_tipo: number;
  Cbte_punto_vta: number;
  Cbte_nro: number;
  Cbte_cuit: string;
}

export interface Actividad {
  Id: number;
}

export interface Cmp {
  Id: number;
  Fecha_cbte: string;
  Cbte_Tipo: CbteTipoExport;
  Punto_vta: number;
  Cbte_nro: number;
  Tipo_expo: TipoExpo;
  Permiso_existente: PermisoExistente;
  Dst_cmp: number;
  Cliente: string;
  Cuit_pais_cliente: string;
  Domicilio_cliente: string;
  Id_impositivo?: string;
  Moneda_Id: string;
  Moneda_ctz: number;
  Obs_comerciales?: string;
  Imp_total: number;
  Obs?: string;
  Forma_pago?: string;
  Incoterms?: string;
  Incoterms_Ds?: string;
  Idioma_cbte: IdiomaCbte;
  Fecha_pago?: string;
  Items: { Item: Item[] };
  Permisos?: { Permiso: Permiso[] };
  Cmps_asoc?: { Cmp_asoc: CmpAsoc[] };
  Actividades_id?: { Actividad_id: Actividad[] };
}
