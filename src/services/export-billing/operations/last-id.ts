import type { SoapClient } from "../../../core/soap/client";
import type { FEXResultID, FexErr } from "../types/response";
import { throwWsfexIfError } from "../_helpers";

interface RawResponse {
  FEXGetLast_IDResult?: {
    FEXResultGet?: FEXResultID;
    FEXErr?: FexErr | FexErr[];
  };
}

export async function fexLastId(client: SoapClient): Promise<{ Id: number }> {
  const raw = await client.call<RawResponse>("FEXGetLast_ID", {});
  const wrap = raw.FEXGetLast_IDResult;
  if (!wrap) {
    throwWsfexIfError([{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXGetLast_ID empty" }]);
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr);
  const r = wrap.FEXResultGet;
  if (!r) {
    throwWsfexIfError([{ ErrCode: "NO_RESULT", ErrMsg: "FEXGetLast_ID missing id" }]);
    throw new Error("unreachable");
  }
  return { Id: r.Id };
}
