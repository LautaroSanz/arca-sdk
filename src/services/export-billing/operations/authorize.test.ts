import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import { fexAuthorize, type FexAuthorizeInput } from "./authorize";
import { WsfexError } from "../../../core/errors/wsn";
import type { Cmp } from "../types/request";

function makeClient(response: unknown): { client: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { client: { call: call as unknown as SoapClient["call"] }, call };
}

const baseCmp: Cmp = {
  Id: 1,
  Fecha_cbte: "20260420",
  Cbte_Tipo: 19,
  Punto_vta: 1,
  Cbte_nro: 1,
  Tipo_expo: 1,
  Permiso_existente: "N",
  Dst_cmp: 200,
  Cliente: "ACME INC",
  Cuit_pais_cliente: "55000000025",
  Domicilio_cliente: "123 Main St",
  Moneda_Id: "DOL",
  Moneda_ctz: 1000,
  Imp_total: 1000,
  Idioma_cbte: 2,
  Items: { Item: [{ Pro_ds: "Consulting", Pro_total_item: 1000 }] },
};

const baseInput: FexAuthorizeInput = { Id: 1, Cmp: baseCmp };

describe("fexAuthorize", () => {
  it("returns FEXResultAuth on success", async () => {
    const { client, call } = makeClient({
      FEXAuthorizeResult: {
        FEXResultAuth: {
          Cuit: "20111111112",
          Id: 1,
          Fecha_cbte: "20260420",
          Cbte_tipo: 19,
          Punto_vta: 1,
          Cbte_nro: 1,
          Reproceso: "N",
          Cae: "75000000000099",
          Fch_venc_Cae: "20260501",
          Resultado: "A",
        },
      },
    });
    const result = await fexAuthorize(client, baseInput);
    expect(result.FEXResultAuth.Cae).toBe("75000000000099");
    expect(result.FEXResultAuth.Resultado).toBe("A");
    expect(call).toHaveBeenCalledWith("FEXAuthorize", { Id: 1, Cmp: baseCmp });
  });

  it("maps FEXErr to WsfexError", async () => {
    const { client } = makeClient({
      FEXAuthorizeResult: { FEXErr: { ErrCode: 1501, ErrMsg: "invalid field" } },
    });
    try {
      await fexAuthorize(client, baseInput);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsfexError);
      expect((err as WsfexError).code).toBe("WSFEX.1501");
    }
  });

  it("normalizes events as array", async () => {
    const { client } = makeClient({
      FEXAuthorizeResult: {
        FEXResultAuth: {
          Cuit: "20111111112",
          Id: 1,
          Fecha_cbte: "20260420",
          Cbte_tipo: 19,
          Punto_vta: 1,
          Cbte_nro: 1,
          Reproceso: "N",
          Cae: "75000000000099",
          Fch_venc_Cae: "20260501",
          Resultado: "A",
        },
        FEXEvents: { EventCode: 9000, EventMsg: "info" },
      },
    });
    const result = await fexAuthorize(client, baseInput);
    expect(result.FEXEvents).toEqual([{ EventCode: 9000, EventMsg: "info" }]);
  });
});
