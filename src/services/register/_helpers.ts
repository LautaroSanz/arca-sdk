import { WsPadronError, type WsPadronErrorCode } from "../../core/errors/wsn";
import { asArray } from "../../core/utils";
import type { Domicilio, Actividad, Impuesto, CategoriaMonotributo, PersonaReturn } from "./types/persona";

export { asArray };

export interface PadronApiError {
  code?: string | number;
  mensaje?: string;
  descripcion?: string;
}

export function throwPadronIfErrors(
  errors: PadronApiError[],
  context?: Record<string, unknown>,
): void {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  const code = `PADRON.${first.code ?? "UNKNOWN"}` as WsPadronErrorCode;
  throw new WsPadronError(code, {
    message: first.mensaje ?? first.descripcion ?? String(code),
    context: { ...context, errors },
  });
}

interface RawPersona {
  idPersona?: number;
  tipoPersona?: string;
  tipoClave?: string;
  estadoClave?: string;
  nombre?: string;
  apellido?: string;
  razonSocial?: string;
  fechaInscripcion?: string;
  fechaNacimiento?: string;
  fechaFallecimiento?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  domicilio?: Domicilio | Domicilio[];
  actividad?: Actividad | Actividad[];
  impuesto?: Impuesto | Impuesto[];
  categoria?: CategoriaMonotributo | CategoriaMonotributo[];
  categoriaMonotributo?: CategoriaMonotributo | CategoriaMonotributo[];
}

export function normalizePersona(raw: RawPersona): PersonaReturn {
  const tipoPersona = raw.tipoPersona === "JURIDICA" ? "JURIDICA" : "FISICA";
  const categorias = asArray(raw.categoriaMonotributo ?? raw.categoria);
  const result: PersonaReturn = {
    idPersona: raw.idPersona ?? 0,
    tipoPersona,
    tipoClave: raw.tipoClave ?? "",
    estadoClave: raw.estadoClave ?? "",
    domicilio: asArray(raw.domicilio),
    actividad: asArray(raw.actividad),
    impuesto: asArray(raw.impuesto),
    categoriasMonotributo: categorias,
  };
  if (raw.nombre !== undefined) result.nombre = raw.nombre;
  if (raw.apellido !== undefined) result.apellido = raw.apellido;
  if (raw.razonSocial !== undefined) result.razonSocial = raw.razonSocial;
  if (raw.fechaInscripcion !== undefined) result.fechaInscripcion = raw.fechaInscripcion;
  if (raw.fechaNacimiento !== undefined) result.fechaNacimiento = raw.fechaNacimiento;
  if (raw.fechaFallecimiento !== undefined) result.fechaFallecimiento = raw.fechaFallecimiento;
  if (raw.tipoDocumento !== undefined) result.tipoDocumento = raw.tipoDocumento;
  if (raw.numeroDocumento !== undefined) result.numeroDocumento = raw.numeroDocumento;
  return result;
}

export function toCuitNumber(cuit: number | string): number {
  if (typeof cuit === "number") return cuit;
  const cleaned = cuit.replace(/[-\s]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) {
    throw new WsPadronError("PADRON.INVALID_CUIT", {
      message: `Invalid CUIT: ${cuit}`,
      context: { cuit },
    });
  }
  return n;
}
