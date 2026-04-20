import type { SoapClient } from "../../../core/soap/client";
import type { FEXResultCotiz, FexErr } from "../types/response";
import { throwWsfexIfError } from "../_helpers";

interface RawResponse {
  FEXGetCotizacionResult?: {
    FEXResGetCotizacion?: FEXResultCotiz;
    FEXErr?: FexErr | FexErr[];
  };
}

export async function fexCotizacion(
  client: SoapClient,
  monId: string,
): Promise<FEXResultCotiz> {
  const raw = await client.call<RawResponse>("FEXGetCotizacion", { Mon_id: monId });
  const wrap = raw.FEXGetCotizacionResult;
  if (!wrap) {
    throwWsfexIfError([{ ErrCode: "EMPTY_RESPONSE", ErrMsg: "FEXGetCotizacion empty" }], {
      monId,
    });
    throw new Error("unreachable");
  }
  throwWsfexIfError(wrap.FEXErr, { monId });
  const r = wrap.FEXResGetCotizacion;
  if (!r) {
    throwWsfexIfError(
      [{ ErrCode: "NO_RESULT", ErrMsg: "FEXGetCotizacion missing cotizacion" }],
      { monId },
    );
    throw new Error("unreachable");
  }
  return r;
}
