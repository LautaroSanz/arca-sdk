import type { SoapClient } from "../../../core/soap/client";
import type { FeCabRequest, FECAEDetRequest } from "../types/request";
import type {
  FeCabResponse,
  FECAEDetResponse,
  Evento,
  ArcaApiError,
  Observacion,
  ResultCode,
} from "../types/response";
import type { Concepto, DocTipo } from "../types/ids";
import { WsfeError } from "../../../core/errors/wsn";
import { asArray, throwWsfeIfErrors } from "../_helpers";

export interface FeCaeSolicitarInput {
  FeCabReq: FeCabRequest;
  FeDetReq: FECAEDetRequest[];
}

export interface FeCaeSolicitarResult {
  FeCabResp: FeCabResponse;
  FeDetResp: FECAEDetResponse[];
  Events: Evento[];
  raw: unknown;
}

export interface DuplicateInvoiceErrorOptions {
  message?: string;
  cause?: unknown;
  existingCae?: string;
  cbteNro?: number;
  context?: Record<string, unknown>;
}

export class DuplicateInvoiceError extends WsfeError {
  readonly existingCae?: string;
  readonly cbteNro?: number;

  constructor(opts: DuplicateInvoiceErrorOptions = {}) {
    super("WSFE.DUPLICATE_INVOICE", {
      message: opts.message ?? "Comprobante ya autorizado",
      cause: opts.cause,
      context: {
        ...opts.context,
        ...(opts.existingCae ? { existingCae: opts.existingCae } : {}),
        ...(opts.cbteNro !== undefined ? { cbteNro: opts.cbteNro } : {}),
      },
    });
    this.existingCae = opts.existingCae;
    this.cbteNro = opts.cbteNro;
  }
}

interface RawDetResp {
  Concepto: Concepto;
  DocTipo: DocTipo;
  DocNro: number | string;
  CbteDesde: number;
  CbteHasta: number;
  CbteFch: string;
  Resultado: ResultCode;
  CAE?: string;
  CAEFchVto?: string;
  Observaciones?: { Obs?: Observacion | Observacion[] };
  Errores?: { Err?: ArcaApiError | ArcaApiError[] };
}

interface RawFECAEResponse {
  FECAESolicitarResult?: {
    FeCabResp?: FeCabResponse;
    FeDetResp?: { FECAEDetResponse?: RawDetResp | RawDetResp[] };
    Events?: { Evt?: Evento | Evento[] };
    Errors?: { Err?: ArcaApiError | ArcaApiError[] };
  };
}

function normalizeDetResp(raw: RawDetResp): FECAEDetResponse {
  const obs = asArray(raw.Observaciones?.Obs);
  const err = asArray(raw.Errores?.Err);
  const base: FECAEDetResponse = {
    Concepto: raw.Concepto,
    DocTipo: raw.DocTipo,
    DocNro: raw.DocNro,
    CbteDesde: raw.CbteDesde,
    CbteHasta: raw.CbteHasta,
    CbteFch: raw.CbteFch,
    Resultado: raw.Resultado,
    Observaciones: obs,
    Errores: err,
  };
  if (raw.CAE !== undefined) base.CAE = raw.CAE;
  if (raw.CAEFchVto !== undefined) base.CAEFchVto = raw.CAEFchVto;
  return base;
}

export async function solicitarCae(
  client: SoapClient,
  input: FeCaeSolicitarInput,
): Promise<FeCaeSolicitarResult> {
  if (input.FeCabReq.CantReg !== input.FeDetReq.length) {
    throw new WsfeError("WSFE.CANT_REG_MISMATCH", {
      message: `FeCabReq.CantReg (${input.FeCabReq.CantReg}) does not match FeDetReq length (${input.FeDetReq.length})`,
      context: {
        CantReg: input.FeCabReq.CantReg,
        detLength: input.FeDetReq.length,
      },
    });
  }

  const raw = await client.call<RawFECAEResponse>("FECAESolicitar", {
    FeCAEReq: {
      FeCabReq: input.FeCabReq,
      FeDetReq: { FECAEDetRequest: input.FeDetReq },
    },
  });

  const wrap = raw.FECAESolicitarResult;
  if (!wrap) {
    throw new WsfeError("WSFE.EMPTY_RESPONSE", {
      message: "FECAESolicitar returned empty response",
    });
  }

  throwWsfeIfErrors(asArray(wrap.Errors?.Err));

  const FeCabResp = wrap.FeCabResp;
  if (!FeCabResp) {
    throw new WsfeError("WSFE.MISSING_CAB_RESP", {
      message: "FECAESolicitar missing FeCabResp",
    });
  }

  const FeDetResp = asArray(wrap.FeDetResp?.FECAEDetResponse).map(normalizeDetResp);

  for (const det of FeDetResp) {
    const errs = det.Errores ?? [];
    if (errs.length === 0) continue;
    const first = errs[0];
    if (!first) continue;
    if (first.Code === 10016) {
      throw new DuplicateInvoiceError({
        message: first.Msg,
        ...(det.CAE !== undefined ? { existingCae: det.CAE } : {}),
        cbteNro: det.CbteDesde,
        context: { errores: errs },
      });
    }
    throw new WsfeError(`WSFE.${first.Code}`, {
      message: first.Msg,
      context: { detail: det, errores: errs },
    });
  }

  return {
    FeCabResp,
    FeDetResp,
    Events: asArray(wrap.Events?.Evt),
    raw,
  };
}
