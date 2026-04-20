import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import { getTiposCbte, getTiposIva, getPtosVenta, getCotizacion } from "./params";
import { WsfeError } from "../../../core/errors/wsn";

function makeClient(response: unknown): { client: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { client: { call: call as unknown as SoapClient["call"] }, call };
}

describe("getTiposCbte", () => {
  it("returns the list when ResultGet has an array", async () => {
    const { client } = makeClient({
      FEParamGetTiposCbteResult: {
        ResultGet: {
          CbteTipo: [
            { Id: 1, Desc: "Factura A", FchDesde: "20100917", FchHasta: "NULL" },
            { Id: 6, Desc: "Factura B", FchDesde: "20100917", FchHasta: "NULL" },
          ],
        },
      },
    });
    const result = await getTiposCbte(client);
    expect(result).toHaveLength(2);
    expect(result[0]?.Desc).toBe("Factura A");
  });

  it("normalizes single-item responses to array", async () => {
    const { client } = makeClient({
      FEParamGetTiposCbteResult: {
        ResultGet: {
          CbteTipo: { Id: 1, Desc: "Factura A", FchDesde: "20100917", FchHasta: "NULL" },
        },
      },
    });
    const result = await getTiposCbte(client);
    expect(result).toHaveLength(1);
  });

  it("throws WsfeError when Errors is present", async () => {
    const { client } = makeClient({
      FEParamGetTiposCbteResult: {
        Errors: { Err: { Code: 501, Msg: "test error" } },
      },
    });
    try {
      await getTiposCbte(client);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfeError);
      expect((err as WsfeError).code).toBe("WSFE.501");
    }
  });
});

describe("getTiposIva", () => {
  it("returns IVA rates", async () => {
    const { client } = makeClient({
      FEParamGetTiposIvaResult: {
        ResultGet: {
          IvaTipo: [
            { Id: 5, Desc: "21%", FchDesde: "20100917", FchHasta: "NULL" },
            { Id: 4, Desc: "10.5%", FchDesde: "20100917", FchHasta: "NULL" },
          ],
        },
      },
    });
    const result = await getTiposIva(client);
    expect(result).toHaveLength(2);
  });
});

describe("getPtosVenta", () => {
  it("returns configured PoS", async () => {
    const { client } = makeClient({
      FEParamGetPtosVentaResult: {
        ResultGet: {
          PtoVenta: { Nro: 1, EmisionTipo: "CAE", Bloqueado: "N" },
        },
      },
    });
    const result = await getPtosVenta(client);
    expect(result).toEqual([{ Nro: 1, EmisionTipo: "CAE", Bloqueado: "N" }]);
  });
});

describe("getCotizacion", () => {
  it("returns single cotizacion result", async () => {
    const { client } = makeClient({
      FEParamGetCotizacionResult: {
        ResultGet: { MonId: "DOL", MonCotiz: 1000, FchCotiz: "20260419" },
      },
    });
    const result = await getCotizacion(client, "DOL");
    expect(result).toEqual({ MonId: "DOL", MonCotiz: 1000, FchCotiz: "20260419" });
  });

  it("passes MonId in the SOAP args", async () => {
    const { client, call } = makeClient({
      FEParamGetCotizacionResult: {
        ResultGet: { MonId: "DOL", MonCotiz: 1000, FchCotiz: "20260419" },
      },
    });
    await getCotizacion(client, "DOL");
    expect(call).toHaveBeenCalledWith("FEParamGetCotizacion", { MonId: "DOL" });
  });

  it("throws WsfeError on Errors", async () => {
    const { client } = makeClient({
      FEParamGetCotizacionResult: {
        Errors: { Err: { Code: 703, Msg: "invalid mon" } },
      },
    });
    await expect(getCotizacion(client, "XXX")).rejects.toBeInstanceOf(WsfeError);
  });
});
