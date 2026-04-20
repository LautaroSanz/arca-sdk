import type { SoapClient } from "../../../core/soap/client";
import type {
  TipoCbte,
  TipoConcepto,
  TipoDoc,
  TipoIva,
  TipoMoneda,
  TipoOpcional,
  TipoTributo,
  PtoVenta,
  Cotizacion,
} from "../types/params";
import type { ArcaApiError } from "../types/response";
import { asArray, throwWsfeIfErrors } from "../_helpers";

interface WrappedList {
  ResultGet?: Record<string, unknown>;
  Errors?: { Err?: ArcaApiError | ArcaApiError[] };
}

async function callList<TItem>(
  client: SoapClient,
  method: string,
  itemKey: string,
): Promise<TItem[]> {
  const res = await client.call<Record<string, WrappedList | undefined>>(method, {});
  const wrap = res[`${method}Result`];
  if (!wrap) return [];
  throwWsfeIfErrors(asArray(wrap.Errors?.Err));
  const raw = wrap.ResultGet?.[itemKey];
  return asArray(raw as TItem | TItem[] | undefined);
}

export async function getTiposCbte(client: SoapClient): Promise<TipoCbte[]> {
  return callList<TipoCbte>(client, "FEParamGetTiposCbte", "CbteTipo");
}

export async function getTiposConcepto(client: SoapClient): Promise<TipoConcepto[]> {
  return callList<TipoConcepto>(client, "FEParamGetTiposConcepto", "ConceptoTipo");
}

export async function getTiposDoc(client: SoapClient): Promise<TipoDoc[]> {
  return callList<TipoDoc>(client, "FEParamGetTiposDoc", "DocTipo");
}

export async function getTiposIva(client: SoapClient): Promise<TipoIva[]> {
  return callList<TipoIva>(client, "FEParamGetTiposIva", "IvaTipo");
}

export async function getTiposMonedas(client: SoapClient): Promise<TipoMoneda[]> {
  return callList<TipoMoneda>(client, "FEParamGetTiposMonedas", "Moneda");
}

export async function getTiposOpcional(client: SoapClient): Promise<TipoOpcional[]> {
  return callList<TipoOpcional>(client, "FEParamGetTiposOpcional", "OpcionalTipo");
}

export async function getTiposTributos(client: SoapClient): Promise<TipoTributo[]> {
  return callList<TipoTributo>(client, "FEParamGetTiposTributos", "TributoTipo");
}

export async function getPtosVenta(client: SoapClient): Promise<PtoVenta[]> {
  return callList<PtoVenta>(client, "FEParamGetPtosVenta", "PtoVenta");
}

interface CotizacionResponse {
  FEParamGetCotizacionResult?: {
    ResultGet?: Cotizacion;
    Errors?: { Err?: ArcaApiError | ArcaApiError[] };
  };
}

export async function getCotizacion(client: SoapClient, monId: string): Promise<Cotizacion> {
  const res = await client.call<CotizacionResponse>("FEParamGetCotizacion", { MonId: monId });
  const wrap = res.FEParamGetCotizacionResult;
  if (!wrap) {
    throwWsfeIfErrors([{ Code: 0, Msg: "FEParamGetCotizacion: empty response" }], { monId });
    throw new Error("unreachable");
  }
  throwWsfeIfErrors(asArray(wrap.Errors?.Err), { monId });
  if (!wrap.ResultGet) {
    throw new Error(`FEParamGetCotizacion: missing ResultGet for MonId=${monId}`);
  }
  return wrap.ResultGet;
}
