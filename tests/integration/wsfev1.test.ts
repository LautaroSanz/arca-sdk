import { describe, it, expect } from "vitest";
import { buildTestArca, hasIntegrationConfig } from "./_helpers";

describe.skipIf(!hasIntegrationConfig())(
  "WSFEv1 integration — read-only ops",
  () => {
    it(
      "FEDummy returns server statuses",
      async () => {
        const arca = buildTestArca();
        const result = await arca.electronicBilling.dummy();
        expect(["OK", "NO"]).toContain(result.AppServer);
        expect(["OK", "NO"]).toContain(result.DbServer);
        expect(["OK", "NO"]).toContain(result.AuthServer);
      },
      30_000,
    );

    it(
      "FEParamGetTiposCbte returns the catalog including Factura B",
      async () => {
        const arca = buildTestArca();
        const tipos = await arca.electronicBilling.params.tiposCbte();
        expect(tipos.length).toBeGreaterThan(0);
        const facturaB = tipos.find((t) => t.Id === 6);
        expect(facturaB).toBeDefined();
      },
      30_000,
    );

    it(
      "FEParamGetTiposIva returns IVA rates",
      async () => {
        const arca = buildTestArca();
        const tipos = await arca.electronicBilling.params.tiposIva();
        expect(tipos.length).toBeGreaterThan(0);
      },
      30_000,
    );

    it(
      "FEParamGetCotizacion returns DOL rate > 0",
      async () => {
        const arca = buildTestArca();
        const cot = await arca.electronicBilling.params.cotizacion("DOL");
        expect(cot.MonId).toBe("DOL");
        expect(cot.MonCotiz).toBeGreaterThan(0);
      },
      30_000,
    );

    it(
      "FECompUltimoAutorizado returns a numeric CbteNro",
      async () => {
        const arca = buildTestArca();
        const result = await arca.electronicBilling.lastAuthorized({
          PtoVta: 1,
          CbteTipo: 6,
        });
        expect(typeof result.CbteNro).toBe("number");
        expect(result.CbteNro).toBeGreaterThanOrEqual(0);
      },
      30_000,
    );
  },
);
