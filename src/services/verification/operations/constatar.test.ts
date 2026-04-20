import { describe, it, expect } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import { constatar } from "./constatar";
import type { CmpReq } from "../types/request";
import { WsCdcError } from "../../../core/errors/wsn";

function makeClient(response: unknown): SoapClient {
  return { call: (async () => response) as unknown as SoapClient["call"] };
}

const baseReq: CmpReq = {
  CbteModo: "CAE",
  CuitEmisor: 20111111112,
  PtoVta: 1,
  CbteTipo: 6,
  CbteNro: 1,
  CbteFch: "20260420",
  ImpTotal: 121,
  CodAutorizacion: "75000000000001",
  DocTipoReceptor: 99,
  DocNroReceptor: 0,
};

describe("constatar (ComprobanteConstatar)", () => {
  it("returns Resultado A on approved comprobante", async () => {
    const client = makeClient({
      ComprobanteConstatarResult: {
        Cuit: "20111111112",
        Cuit_cdc: "20111111111",
        FchProceso: "20260420",
        Resultado: "A",
      },
    });
    const result = await constatar(client, baseReq);
    expect(result.Resultado).toBe("A");
    expect(result.Cuit).toBe("20111111112");
    expect(result.Events).toEqual([]);
    expect(result.Observaciones).toEqual([]);
  });

  it("normalizes single Obs to array", async () => {
    const client = makeClient({
      ComprobanteConstatarResult: {
        Resultado: "O",
        Observaciones: { Obs: { Code: 10001, Msg: "watch" } },
      },
    });
    const result = await constatar(client, baseReq);
    expect(result.Resultado).toBe("O");
    expect(result.Observaciones).toEqual([{ Code: 10001, Msg: "watch" }]);
  });

  it("throws WsCdcError on Errors", async () => {
    const client = makeClient({
      ComprobanteConstatarResult: {
        Errors: { Err: { Code: 900, Msg: "not found" } },
      },
    });
    try {
      await constatar(client, baseReq);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsCdcError);
      expect((err as WsCdcError).code).toBe("CDC.900");
    }
  });
});
