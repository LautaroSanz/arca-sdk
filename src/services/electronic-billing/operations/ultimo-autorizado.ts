import type { SoapClient } from "../../../core/soap/client";
import type { CbteTipo } from "../types/ids";
import type { Evento, ArcaApiError } from "../types/response";
import { asArray, throwWsfeIfErrors } from "../_helpers";

export interface UltimoAutorizadoInput {
  PtoVta: number;
  CbteTipo: CbteTipo;
}

export interface UltimoAutorizadoResult {
  PtoVta: number;
  CbteTipo: CbteTipo;
  CbteNro: number;
  Events: Evento[];
}

interface RawResponse {
  FECompUltimoAutorizadoResult?: {
    PtoVta: number;
    CbteTipo: CbteTipo;
    CbteNro: number;
    Events?: { Evt?: Evento | Evento[] };
    Errors?: { Err?: ArcaApiError | ArcaApiError[] };
  };
}

export async function ultimoAutorizado(
  client: SoapClient,
  input: UltimoAutorizadoInput,
): Promise<UltimoAutorizadoResult> {
  const res = await client.call<RawResponse>("FECompUltimoAutorizado", {
    PtoVta: input.PtoVta,
    CbteTipo: input.CbteTipo,
  });
  const wrap = res.FECompUltimoAutorizadoResult;
  if (!wrap) {
    throwWsfeIfErrors([{ Code: 0, Msg: "FECompUltimoAutorizado: empty response" }], { ...input });
    throw new Error("unreachable");
  }
  throwWsfeIfErrors(asArray(wrap.Errors?.Err), { ...input });
  return {
    PtoVta: wrap.PtoVta,
    CbteTipo: wrap.CbteTipo,
    CbteNro: wrap.CbteNro,
    Events: asArray(wrap.Events?.Evt),
  };
}
