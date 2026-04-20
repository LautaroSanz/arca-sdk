import type { SoapClient } from "../../../core/soap/client";
import type { MtxcaApiError } from "../types/response";
import { asArray, throwMtxcaIfErrors } from "../_helpers";
import { WsMtxcaError } from "../../../core/errors/wsn";

export interface MtxcaUltimoInput {
  codigoTipoComprobante: number;
  numeroPuntoVenta: number;
}

export interface MtxcaUltimoResult {
  codigoTipoComprobante: number;
  numeroPuntoVenta: number;
  numeroComprobante: number;
}

interface RawResponse {
  consultaUltimoComprobanteAutorizadoReturn?: MtxcaUltimoResult;
  arrayErrores?: { error?: MtxcaApiError | MtxcaApiError[] };
}

export async function mtxcaUltimoAutorizado(
  client: SoapClient,
  input: MtxcaUltimoInput,
): Promise<MtxcaUltimoResult> {
  const raw = await client.call<RawResponse>("consultarUltimoComprobanteAutorizado", {
    consultaUltimoComprobanteAutorizadoRequest: input,
  });
  throwMtxcaIfErrors(asArray(raw.arrayErrores?.error), { ...input });
  const r = raw.consultaUltimoComprobanteAutorizadoReturn;
  if (!r) {
    throw new WsMtxcaError("MTXCA.EMPTY_RESPONSE", {
      message: "consultarUltimoComprobanteAutorizado missing result",
      context: { ...input },
    });
  }
  return r;
}
