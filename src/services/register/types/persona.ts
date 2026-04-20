export type TipoPersona = "FISICA" | "JURIDICA";

export interface Domicilio {
  codigoPostal?: string;
  tipoDomicilio?: string;
  direccion?: string;
  localidad?: string;
  idProvincia?: number;
  descripcionProvincia?: string;
}

export interface Actividad {
  idActividad: number;
  descripcionActividad?: string;
  nomenclador?: number;
  periodo?: number;
  orden?: number;
}

export interface Impuesto {
  idImpuesto: number;
  descripcionImpuesto?: string;
  periodo?: number;
  estado?: string;
}

export interface CategoriaMonotributo {
  idImpuesto?: number;
  descripcionCategoria?: string;
  periodo?: number;
  estado?: string;
}

export interface PersonaReturn {
  idPersona: number;
  tipoPersona: TipoPersona;
  tipoClave: string;
  estadoClave: string;
  nombre?: string;
  apellido?: string;
  razonSocial?: string;
  fechaInscripcion?: string;
  fechaNacimiento?: string;
  fechaFallecimiento?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  domicilio?: Domicilio[];
  actividad?: Actividad[];
  impuesto?: Impuesto[];
  categoriasMonotributo?: CategoriaMonotributo[];
}

export interface PersonaMetadata {
  fechaHora?: string;
  servidor?: string;
}
