import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import {
  solicitarCae,
  DuplicateInvoiceError,
  type FeCaeSolicitarInput,
} from "./fecae-solicitar";
import { WsfeError } from "../../../core/errors/wsn";

function makeClient(response: unknown): { client: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { client: { call: call as unknown as SoapClient["call"] }, call };
}

const baseInput: FeCaeSolicitarInput = {
  FeCabReq: { CantReg: 1, PtoVta: 1, CbteTipo: 6 },
  FeDetReq: [
    {
      Concepto: 1,
      DocTipo: 96,
      DocNro: 12345678,
      CbteDesde: 1,
      CbteHasta: 1,
      CbteFch: "20260419",
      ImpTotal: 121,
      ImpTotConc: 0,
      ImpNeto: 100,
      ImpOpEx: 0,
      ImpTrib: 0,
      ImpIVA: 21,
      MonId: "PES",
      MonCotiz: 1,
      Iva: { AlicIva: [{ Id: 5, BaseImp: 100, Importe: 21 }] },
    },
  ],
};

function happyDetResponse(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    Concepto: 1,
    DocTipo: 96,
    DocNro: 12345678,
    CbteDesde: 1,
    CbteHasta: 1,
    CbteFch: "20260419",
    Resultado: "A",
    CAE: "75000000000001",
    CAEFchVto: "20260430",
    ...overrides,
  };
}

describe("solicitarCae — local validation", () => {
  it("throws WSFE.CANT_REG_MISMATCH when CantReg differs from FeDetReq length", async () => {
    const { client } = makeClient({});
    try {
      await solicitarCae(client, {
        FeCabReq: { CantReg: 2, PtoVta: 1, CbteTipo: 6 },
        FeDetReq: baseInput.FeDetReq,
      });
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfeError);
      expect((err as WsfeError).code).toBe("WSFE.CANT_REG_MISMATCH");
    }
  });
});

describe("solicitarCae — happy path", () => {
  it("returns CAE on successful authorization", async () => {
    const { client, call } = makeClient({
      FECAESolicitarResult: {
        FeCabResp: {
          CantReg: 1,
          PtoVta: 1,
          CbteTipo: 6,
          Result: "A",
          Cuit: "20111111112",
          FchProceso: "20260419",
          Reproceso: "N",
        },
        FeDetResp: { FECAEDetResponse: happyDetResponse() },
      },
    });
    const result = await solicitarCae(client, baseInput);
    expect(result.FeCabResp.Result).toBe("A");
    expect(result.FeDetResp).toHaveLength(1);
    expect(result.FeDetResp[0]?.CAE).toBe("75000000000001");
    expect(result.FeDetResp[0]?.CAEFchVto).toBe("20260430");
    expect(call).toHaveBeenCalledWith("FECAESolicitar", {
      FeCAEReq: {
        FeCabReq: baseInput.FeCabReq,
        FeDetReq: { FECAEDetRequest: baseInput.FeDetReq },
      },
    });
  });

  it("exposes non-fatal Observaciones in successful result", async () => {
    const { client } = makeClient({
      FECAESolicitarResult: {
        FeCabResp: {
          CantReg: 1,
          PtoVta: 1,
          CbteTipo: 6,
          Result: "A",
          Cuit: "20111111112",
          FchProceso: "20260419",
          Reproceso: "N",
        },
        FeDetResp: {
          FECAEDetResponse: happyDetResponse({
            Observaciones: { Obs: { Code: 10023, Msg: "info observation" } },
          }),
        },
      },
    });
    const result = await solicitarCae(client, baseInput);
    expect(result.FeDetResp[0]?.Observaciones).toEqual([
      { Code: 10023, Msg: "info observation" },
    ]);
  });
});

describe("solicitarCae — error mapping", () => {
  it("maps top-level Errors to WsfeError", async () => {
    const { client } = makeClient({
      FECAESolicitarResult: {
        Errors: { Err: { Code: 501, Msg: "invalid auth" } },
      },
    });
    try {
      await solicitarCae(client, baseInput);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfeError);
      expect((err as WsfeError).code).toBe("WSFE.501");
    }
  });

  it("maps per-detail rejection (Resultado=R) to WsfeError", async () => {
    const { client } = makeClient({
      FECAESolicitarResult: {
        FeCabResp: {
          CantReg: 1,
          PtoVta: 1,
          CbteTipo: 6,
          Result: "R",
          Cuit: "20111111112",
          FchProceso: "20260419",
          Reproceso: "N",
        },
        FeDetResp: {
          FECAEDetResponse: {
            ...happyDetResponse({ Resultado: "R", CAE: undefined }),
            Errores: { Err: { Code: 10015, Msg: "fecha invalida" } },
          },
        },
      },
    });
    try {
      await solicitarCae(client, baseInput);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfeError);
      expect((err as WsfeError).code).toBe("WSFE.10015");
    }
  });

  it("maps error code 10016 to DuplicateInvoiceError with existingCae", async () => {
    const { client } = makeClient({
      FECAESolicitarResult: {
        FeCabResp: {
          CantReg: 1,
          PtoVta: 1,
          CbteTipo: 6,
          Result: "R",
          Cuit: "20111111112",
          FchProceso: "20260419",
          Reproceso: "N",
        },
        FeDetResp: {
          FECAEDetResponse: {
            ...happyDetResponse({ CAE: "75999999999999" }),
            Errores: { Err: { Code: 10016, Msg: "Comprobante ya autorizado" } },
          },
        },
      },
    });
    try {
      await solicitarCae(client, baseInput);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(DuplicateInvoiceError);
      expect(err).toBeInstanceOf(WsfeError);
      const dup = err as DuplicateInvoiceError;
      expect(dup.code).toBe("WSFE.DUPLICATE_INVOICE");
      expect(dup.existingCae).toBe("75999999999999");
      expect(dup.cbteNro).toBe(1);
    }
  });

  it("throws WSFE.EMPTY_RESPONSE when result is missing", async () => {
    const { client } = makeClient({});
    try {
      await solicitarCae(client, baseInput);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfeError);
      expect((err as WsfeError).code).toBe("WSFE.EMPTY_RESPONSE");
    }
  });
});

describe("solicitarCae — batched details", () => {
  it("handles FeDetResp as array for multi-invoice batches", async () => {
    const batchInput: FeCaeSolicitarInput = {
      FeCabReq: { CantReg: 2, PtoVta: 1, CbteTipo: 6 },
      FeDetReq: [baseInput.FeDetReq[0]!, { ...baseInput.FeDetReq[0]!, CbteDesde: 2, CbteHasta: 2 }],
    };
    const { client } = makeClient({
      FECAESolicitarResult: {
        FeCabResp: {
          CantReg: 2,
          PtoVta: 1,
          CbteTipo: 6,
          Result: "A",
          Cuit: "20111111112",
          FchProceso: "20260419",
          Reproceso: "N",
        },
        FeDetResp: {
          FECAEDetResponse: [
            happyDetResponse({ CbteDesde: 1, CbteHasta: 1, CAE: "75000000000001" }),
            happyDetResponse({ CbteDesde: 2, CbteHasta: 2, CAE: "75000000000002" }),
          ],
        },
      },
    });
    const result = await solicitarCae(client, batchInput);
    expect(result.FeDetResp).toHaveLength(2);
    expect(result.FeDetResp[0]?.CAE).toBe("75000000000001");
    expect(result.FeDetResp[1]?.CAE).toBe("75000000000002");
  });
});
