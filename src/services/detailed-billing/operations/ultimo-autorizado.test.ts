import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import { mtxcaUltimoAutorizado } from "./ultimo-autorizado";
import { WsMtxcaError } from "../../../core/errors/wsn";

function makeClient(response: unknown): { client: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { client: { call: call as unknown as SoapClient["call"] }, call };
}

describe("mtxcaUltimoAutorizado", () => {
  it("returns numeroComprobante on success", async () => {
    const { client, call } = makeClient({
      consultaUltimoComprobanteAutorizadoReturn: {
        codigoTipoComprobante: 1,
        numeroPuntoVenta: 1,
        numeroComprobante: 42,
      },
    });
    const result = await mtxcaUltimoAutorizado(client, {
      codigoTipoComprobante: 1,
      numeroPuntoVenta: 1,
    });
    expect(result.numeroComprobante).toBe(42);
    expect(call).toHaveBeenCalledWith("consultarUltimoComprobanteAutorizado", {
      consultaUltimoComprobanteAutorizadoRequest: {
        codigoTipoComprobante: 1,
        numeroPuntoVenta: 1,
      },
    });
  });

  it("throws WsMtxcaError on arrayErrores", async () => {
    const { client } = makeClient({
      arrayErrores: {
        error: { codigoDescripcion: { codigo: 1001, descripcion: "auth fail" } },
      },
    });
    try {
      await mtxcaUltimoAutorizado(client, { codigoTipoComprobante: 1, numeroPuntoVenta: 1 });
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsMtxcaError);
      expect((err as WsMtxcaError).code).toBe("MTXCA.1001");
    }
  });
});
