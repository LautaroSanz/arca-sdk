import { describe, it, expect } from "vitest";
import { buildTestArca, hasIntegrationConfig } from "./_helpers";

describe.skipIf(!hasIntegrationConfig())("WSFEXv1 integration (read-only ops)", () => {
  it(
    "FEXDummy returns server statuses",
    async () => {
      const arca = buildTestArca();
      const result = await arca.exportBilling.dummy();
      expect(["OK", "NO"]).toContain(result.AppServer);
      expect(["OK", "NO"]).toContain(result.DbServer);
      expect(["OK", "NO"]).toContain(result.AuthServer);
    },
    30_000,
  );

  it(
    "FEXGetLast_ID returns numeric Id",
    async () => {
      const arca = buildTestArca();
      const result = await arca.exportBilling.lastId();
      expect(typeof result.Id).toBe("number");
    },
    30_000,
  );

  it(
    "FEXGetLast_CMP returns numeric Cbte_nro",
    async () => {
      const arca = buildTestArca();
      const result = await arca.exportBilling.lastAuthorized({
        Cbte_Tipo: 19,
        Pto_venta: 1,
      });
      expect(typeof result.Cbte_nro).toBe("number");
    },
    30_000,
  );

  it(
    "FEXGetCotizacion returns DOL rate",
    async () => {
      const arca = buildTestArca();
      const cot = await arca.exportBilling.cotizacion("DOL");
      expect(cot.Mon_id).toBe("DOL");
      expect(cot.Mon_ctz).toBeGreaterThan(0);
    },
    30_000,
  );
});
