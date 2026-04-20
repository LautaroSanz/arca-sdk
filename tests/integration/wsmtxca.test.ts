import { describe, it, expect } from "vitest";
import { buildTestArca, hasIntegrationConfig } from "./_helpers";

describe.skipIf(!hasIntegrationConfig())("WSMTXCA integration (read-only ops)", () => {
  it(
    "dummy returns server statuses",
    async () => {
      const arca = buildTestArca();
      const result = await arca.detailedBilling.dummy();
      expect(["OK", "NO"]).toContain(result.appserver);
      expect(["OK", "NO"]).toContain(result.dbserver);
      expect(["OK", "NO"]).toContain(result.authserver);
    },
    30_000,
  );

  it(
    "consultarUltimoComprobanteAutorizado returns numeric result",
    async () => {
      const arca = buildTestArca();
      const result = await arca.detailedBilling.lastAuthorized({
        codigoTipoComprobante: 1,
        numeroPuntoVenta: 1,
      });
      expect(typeof result.numeroComprobante).toBe("number");
    },
    30_000,
  );
});
