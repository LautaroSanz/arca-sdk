import { describe, it, expect } from "vitest";
import {
  buildTestArca,
  EMIT_REAL_ENABLED,
  hasIntegrationConfig,
  todayYyyymmdd,
} from "./_helpers";

describe.skipIf(!hasIntegrationConfig() || !EMIT_REAL_ENABLED)(
  "WSFEv1 integration — CAE emission (REAL, gated by ARCA_EMIT_REAL=1)",
  () => {
    it(
      "emits a Factura B to Consumidor Final and receives a CAE",
      async () => {
        const arca = buildTestArca();
        const ptoVta = Number(process.env["ARCA_TEST_PTOVTA"] ?? "1");

        const last = await arca.electronicBilling.lastAuthorized({
          PtoVta: ptoVta,
          CbteTipo: 6,
        });
        const nextNro = last.CbteNro + 1;

        const result = await arca.electronicBilling.createInvoice({
          FeCabReq: { CantReg: 1, PtoVta: ptoVta, CbteTipo: 6 },
          FeDetReq: [
            {
              Concepto: 1,
              DocTipo: 99,
              DocNro: 0,
              CbteDesde: nextNro,
              CbteHasta: nextNro,
              CbteFch: todayYyyymmdd(),
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
        });

        expect(result.FeCabResp.Result).toBe("A");
        expect(result.FeDetResp).toHaveLength(1);
        const cae = result.FeDetResp[0]?.CAE;
        expect(cae).toBeTruthy();
        expect(cae).toMatch(/^\d+$/);
        expect(result.FeDetResp[0]?.CAEFchVto).toMatch(/^\d{8}$/);
      },
      60_000,
    );
  },
);
