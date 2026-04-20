import type { SoapClient } from "../../../core/soap/client";
import type { Cmp } from "../types/request";
import type { FEXResultAuth, FexErr, FexEvent } from "../types/response";
import { throwWsfexIfError, asArray } from "../_helpers";

export interface FexAuthorizeInput {
  Id: number;
  Cmp: Cmp;
}

export interface FexAuthorizeResult {
  FEXResultAuth: FEXResultAuth;
  FEXEvents: FexEvent[];
  raw: unknown;
}

interface RawFEXAuthorizeResponse {
  FEXAuthorizeResult?: {
    FEXResultAuth?: FEXResultAuth;
    FEXErr?: FexErr | FexErr[];
    FEXEvents?: FexEvent | FexEvent[];
  };
}

export async function fexAuthorize(
  client: SoapClient,
  input: FexAuthorizeInput,
): Promise<FexAuthorizeResult> {
  const raw = await client.call<RawFEXAuthorizeResponse>("FEXAuthorize", {
    Id: input.Id,
    Cmp: input.Cmp,
  });
  const wrap = raw.FEXAuthorizeResult;
  if (!wrap) {
    throwWsfexIfError(
      [{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXAuthorize returned empty response" }],
      { id: input.Id },
    );
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr, { id: input.Id });
  if (!wrap.FEXResultAuth) {
    throwWsfexIfError(
      [{ ErrCode: "NO_RESULT", ErrMsg: "FEXAuthorize missing FEXResultAuth" }],
      { id: input.Id },
    );
    throw new Error("unreachable");
  }
  return {
    FEXResultAuth: wrap.FEXResultAuth,
    FEXEvents: asArray(wrap.FEXEvents),
    raw,
  };
}
