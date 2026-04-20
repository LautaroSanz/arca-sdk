import type { SoapClient } from "../../../core/soap/client";
import type { FEXResultGet, FexErr } from "../types/response";
import { throwWsfexIfError } from "../_helpers";

export interface FexLastCmpInput {
  Cbte_Tipo: number;
  Pto_venta: number;
}

export interface FexLastCmpResult {
  Cbte_tipo: number;
  Punto_vta: number;
  Cbte_nro: number;
}

interface RawResponse {
  FEXGetLast_CMPResult?: {
    FEXResult_LastCMP?: FEXResultGet;
    FEXErr?: FexErr | FexErr[];
  };
}

export async function fexLastCmp(
  client: SoapClient,
  input: FexLastCmpInput,
): Promise<FexLastCmpResult> {
  const raw = await client.call<RawResponse>("FEXGetLast_CMP", input);
  const wrap = raw.FEXGetLast_CMPResult;
  if (!wrap) {
    throwWsfexIfError(
      [{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXGetLast_CMP empty response" }],
      { ...input },
    );
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr, { ...input });
  const r = wrap.FEXResult_LastCMP;
  if (!r) {
    throwWsfexIfError(
      [{ ErrCode: "NO_RESULT", ErrMsg: "FEXGetLast_CMP missing FEXResult_LastCMP" }],
      { ...input },
    );
    throw new Error("unreachable");
  }
  return { Cbte_tipo: r.Cbte_tipo, Punto_vta: r.Punto_vta, Cbte_nro: r.Cbte_nro };
}
