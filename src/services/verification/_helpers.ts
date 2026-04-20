import { WsCdcError, type WsCdcErrorCode } from "../../core/errors/wsn";
import { asArray } from "../../core/utils";
import type { CdcApiError } from "./types/response";

export { asArray };

export function throwCdcIfErrors(
  errors: CdcApiError[],
  context?: Record<string, unknown>,
): void {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  throw new WsCdcError(`CDC.${first.Code}` as WsCdcErrorCode, {
    message: first.Msg,
    context: { ...context, errors },
  });
}
