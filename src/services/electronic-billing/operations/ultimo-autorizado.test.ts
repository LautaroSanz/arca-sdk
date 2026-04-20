import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import { ultimoAutorizado } from "./ultimo-autorizado";
import { WsfeError } from "../../../core/errors/wsn";

function makeClient(response: unknown): { client: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { client: { call: call as unknown as SoapClient["call"] }, call };
}

describe("ultimoAutorizado (FECompUltimoAutorizado)", () => {
  it("returns CbteNro on success", async () => {
    const { client, call } = makeClient({
      FECompUltimoAutorizadoResult: {
        PtoVta: 1,
        CbteTipo: 6,
        CbteNro: 42,
      },
    });
    const result = await ultimoAutorizado(client, { PtoVta: 1, CbteTipo: 6 });
    expect(result.CbteNro).toBe(42);
    expect(result.Events).toEqual([]);
    expect(call).toHaveBeenCalledWith("FECompUltimoAutorizado", { PtoVta: 1, CbteTipo: 6 });
  });

  it("CbteNro=0 means first emission (valid)", async () => {
    const { client } = makeClient({
      FECompUltimoAutorizadoResult: { PtoVta: 1, CbteTipo: 6, CbteNro: 0 },
    });
    const result = await ultimoAutorizado(client, { PtoVta: 1, CbteTipo: 6 });
    expect(result.CbteNro).toBe(0);
  });

  it("normalizes single Evento object to array", async () => {
    const { client } = makeClient({
      FECompUltimoAutorizadoResult: {
        PtoVta: 1,
        CbteTipo: 6,
        CbteNro: 10,
        Events: { Evt: { Code: 1000, Msg: "info" } },
      },
    });
    const result = await ultimoAutorizado(client, { PtoVta: 1, CbteTipo: 6 });
    expect(result.Events).toEqual([{ Code: 1000, Msg: "info" }]);
  });

  it("throws WsfeError when server returns Errors", async () => {
    const { client } = makeClient({
      FECompUltimoAutorizadoResult: {
        PtoVta: 1,
        CbteTipo: 6,
        CbteNro: 0,
        Errors: { Err: { Code: 600, Msg: "auth failed" } },
      },
    });
    try {
      await ultimoAutorizado(client, { PtoVta: 1, CbteTipo: 6 });
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfeError);
      expect((err as WsfeError).code).toBe("WSFE.600");
    }
  });
});
