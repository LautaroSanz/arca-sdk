import type { SoapClient } from "../../../core/soap/client";
import type { CmpReq } from "../types/request";
import type {
  ConstatarResult,
  CdcResultado,
  CdcEvento,
  CdcObservacion,
  CdcApiError,
} from "../types/response";
import { asArray, throwCdcIfErrors } from "../_helpers";
import { WsCdcError } from "../../../core/errors/wsn";

interface RawResponse {
  ComprobanteConstatarResult?: {
    Cuit?: string;
    Cuit_cdc?: string;
    FchProceso?: string;
    Resultado?: CdcResultado;
    Events?: { Evt?: CdcEvento | CdcEvento[] };
    Observaciones?: { Obs?: CdcObservacion | CdcObservacion[] };
    Errors?: { Err?: CdcApiError | CdcApiError[] };
  };
}

export async function constatar(
  client: SoapClient,
  req: CmpReq,
): Promise<ConstatarResult> {
  const raw = await client.call<RawResponse>("ComprobanteConstatar", { CmpReq: req });
  const wrap = raw.ComprobanteConstatarResult;
  if (!wrap) {
    throw new WsCdcError("CDC.EMPTY_RESPONSE", {
      message: "ComprobanteConstatar returned empty response",
    });
  }
  throwCdcIfErrors(asArray(wrap.Errors?.Err));
  if (!wrap.Resultado) {
    throw new WsCdcError("CDC.NO_RESULT", {
      message: "ComprobanteConstatar missing Resultado",
    });
  }
  const result: ConstatarResult = {
    Resultado: wrap.Resultado,
    Events: asArray(wrap.Events?.Evt),
    Observaciones: asArray(wrap.Observaciones?.Obs),
  };
  if (wrap.Cuit !== undefined) result.Cuit = wrap.Cuit;
  if (wrap.Cuit_cdc !== undefined) result.Cuit_cdc = wrap.Cuit_cdc;
  if (wrap.FchProceso !== undefined) result.FchProceso = wrap.FchProceso;
  return result;
}
