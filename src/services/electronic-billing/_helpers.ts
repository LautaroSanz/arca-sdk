import { WsfeError } from "../../core/errors/wsn";
import type { ArcaApiError } from "./types/response";

export { asArray } from "../../core/utils";

export function throwWsfeIfErrors(errors: ArcaApiError[], context?: Record<string, unknown>): void {
  if (errors.length === 0) return;
  const first = errors[0];
  if (!first) return;
  throw new WsfeError(`WSFE.${first.Code}`, {
    message: first.Msg,
    context: { ...context, code: first.Code, errors },
  });
}
