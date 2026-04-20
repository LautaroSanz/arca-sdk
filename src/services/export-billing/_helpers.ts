import { WsfexError, type WsfexErrorCode } from "../../core/errors/wsn";
import { asArray } from "../../core/utils";
import type { FexErr } from "./types/response";

export { asArray };

export function throwWsfexIfError(
  err: FexErr | FexErr[] | null | undefined,
  context?: Record<string, unknown>,
): void {
  const list = asArray(err);
  if (list.length === 0) return;
  const first = list[0];
  if (!first || !first.ErrCode || Number(first.ErrCode) === 0) return;
  const code = `WSFEX.${first.ErrCode}` as WsfexErrorCode;
  throw new WsfexError(code, {
    message: first.ErrMsg,
    context: { ...context, errors: list },
  });
}
