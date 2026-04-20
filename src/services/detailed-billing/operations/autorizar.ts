import type { SoapClient } from "../../../core/soap/client";
import type { ComprobanteCAERequest } from "../types/request";
import type { ComprobanteCAEResponse, MtxcaApiError, MtxcaEvento } from "../types/response";
import { asArray, throwMtxcaIfErrors } from "../_helpers";
import { WsMtxcaError } from "../../../core/errors/wsn";

export interface MtxcaAutorizarResult {
  comprobanteResponse: ComprobanteCAEResponse;
  eventos: MtxcaEvento[];
  raw: unknown;
}

interface RawAutorizarResponse {
  comprobanteResponse?: ComprobanteCAEResponse;
  arrayEventos?: { evento?: MtxcaEvento | MtxcaEvento[] };
  arrayErrores?: { error?: MtxcaApiError | MtxcaApiError[] };
}

export async function mtxcaAutorizar(
  client: SoapClient,
  comprobante: ComprobanteCAERequest,
): Promise<MtxcaAutorizarResult> {
  const raw = await client.call<RawAutorizarResponse>("autorizarComprobante", {
    comprobanteCAERequest: comprobante,
  });
  throwMtxcaIfErrors(asArray(raw.arrayErrores?.error), {
    comprobante: comprobante.numeroComprobante,
  });
  if (!raw.comprobanteResponse) {
    throw new WsMtxcaError("MTXCA.EMPTY_RESPONSE", {
      message: "autorizarComprobante missing comprobanteResponse",
    });
  }
  return {
    comprobanteResponse: raw.comprobanteResponse,
    eventos: asArray(raw.arrayEventos?.evento),
    raw,
  };
}
