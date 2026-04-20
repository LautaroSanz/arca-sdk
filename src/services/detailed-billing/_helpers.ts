import { WsMtxcaError, type WsMtxcaErrorCode } from "../../core/errors/wsn";
import { asArray } from "../../core/utils";
import type { MtxcaApiError } from "./types/response";

export { asArray };

export function throwMtxcaIfErrors(
  errors: MtxcaApiError[],
  context?: Record<string, unknown>,
): void {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  const rawCode = first.codigoDescripcion?.codigo ?? first.codigo ?? "UNKNOWN";
  const msg = first.codigoDescripcion?.descripcion ?? first.descripcion ?? String(rawCode);
  throw new WsMtxcaError(`MTXCA.${rawCode}` as WsMtxcaErrorCode, {
    message: msg,
    context: { ...context, errors },
  });
}
