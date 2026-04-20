import { describe, it, expect } from "vitest";
import * as publicApi from "./index";

describe("public API shape", () => {
  it("exports SDK_VERSION", () => {
    expect(publicApi.SDK_VERSION).toBe("0.5.0");
  });

  it("exports Arca class", () => {
    expect(typeof publicApi.Arca).toBe("function");
  });

  it("exports error classes instantiable and in hierarchy", () => {
    expect(publicApi.ArcaError).toBeDefined();
    expect(publicApi.ConfigError).toBeDefined();
    expect(publicApi.CryptoError).toBeDefined();
    expect(publicApi.WsaaError).toBeDefined();
    expect(publicApi.SoapError).toBeDefined();
    expect(publicApi.WsnError).toBeDefined();
    expect(publicApi.WsfeError).toBeDefined();
    expect(publicApi.TimeSkewError).toBeDefined();
    expect(publicApi.DuplicateInvoiceError).toBeDefined();
    expect(publicApi.WsPadronError).toBeDefined();
    expect(publicApi.WsfexError).toBeDefined();
    expect(publicApi.WsMtxcaError).toBeDefined();
    expect(publicApi.WsCdcError).toBeDefined();
    expect(new publicApi.ConfigError("CONFIG.X")).toBeInstanceOf(publicApi.ArcaError);
    expect(new publicApi.DuplicateInvoiceError()).toBeInstanceOf(publicApi.WsfeError);
    expect(new publicApi.WsPadronError("PADRON.X")).toBeInstanceOf(publicApi.WsnError);
    expect(new publicApi.WsfexError("WSFEX.X")).toBeInstanceOf(publicApi.WsnError);
    expect(new publicApi.WsMtxcaError("MTXCA.X")).toBeInstanceOf(publicApi.WsnError);
    expect(new publicApi.WsCdcError("CDC.X")).toBeInstanceOf(publicApi.WsnError);
  });

  it("exports isRetryable helper", () => {
    expect(typeof publicApi.isRetryable).toBe("function");
  });

  it("exports storage adapters", () => {
    expect(publicApi.MemoryTicketStorage).toBeDefined();
    expect(publicApi.FsTicketStorage).toBeDefined();
  });

  it("exports clock factories", () => {
    expect(publicApi.createNtpClock).toBeDefined();
    expect(publicApi.createSystemClock).toBeDefined();
  });

  it("exports logger helpers", () => {
    expect(publicApi.noopLogger).toBeDefined();
    expect(typeof publicApi.consoleLogger).toBe("function");
  });

  it("exports ENDPOINTS with both environments", () => {
    expect(publicApi.ENDPOINTS.testing.wsaa).toContain("afip");
    expect(publicApi.ENDPOINTS.production.wsaa).toContain("afip");
  });

  it("exports AccessTicket helpers", () => {
    expect(typeof publicApi.isExpired).toBe("function");
    expect(typeof publicApi.isAboutToExpire).toBe("function");
  });

  it("exports WSFEv1 id constants", () => {
    expect(publicApi.CbteTipo.FacturaB).toBe(6);
    expect(publicApi.Concepto.Productos).toBe(1);
    expect(publicApi.DocTipo.CUIT).toBe(80);
    expect(publicApi.IvaId.IVA21).toBe(5);
  });
});

describe("Arca construction", () => {
  it("constructs with minimum required options without throwing", () => {
    expect(
      () =>
        new publicApi.Arca({
          cuit: "20111111112",
          cert: "dummy-pem",
          key: "dummy-pem",
          environment: "testing",
        }),
    ).not.toThrow();
  });

  it("exposes electronicBilling with expected methods", () => {
    const arca = new publicApi.Arca({
      cuit: "20111111112",
      cert: "dummy-pem",
      key: "dummy-pem",
      environment: "testing",
    });
    expect(typeof arca.electronicBilling.dummy).toBe("function");
    expect(typeof arca.electronicBilling.createInvoice).toBe("function");
    expect(typeof arca.electronicBilling.lastAuthorized).toBe("function");
    expect(typeof arca.electronicBilling.params.tiposCbte).toBe("function");
    expect(typeof arca.electronicBilling.params.cotizacion).toBe("function");
    expect(typeof arca.register.personaA4).toBe("function");
    expect(typeof arca.register.personaA10).toBe("function");
    expect(typeof arca.register.personaA13).toBe("function");
    expect(typeof arca.exportBilling.dummy).toBe("function");
    expect(typeof arca.exportBilling.createInvoice).toBe("function");
    expect(typeof arca.exportBilling.lastAuthorized).toBe("function");
    expect(typeof arca.exportBilling.lastId).toBe("function");
    expect(typeof arca.exportBilling.cotizacion).toBe("function");
    expect(typeof arca.detailedBilling.dummy).toBe("function");
    expect(typeof arca.detailedBilling.createInvoice).toBe("function");
    expect(typeof arca.detailedBilling.lastAuthorized).toBe("function");
    expect(typeof arca.verification.dummy).toBe("function");
    expect(typeof arca.verification.constatar).toBe("function");
  });

  it("accepts custom storage, clock, and logger", () => {
    const storage = new publicApi.MemoryTicketStorage();
    const clock = publicApi.createSystemClock();
    const logger = publicApi.noopLogger;
    expect(
      () =>
        new publicApi.Arca({
          cuit: "20111111112",
          cert: "dummy-pem",
          key: "dummy-pem",
          environment: "testing",
          storage,
          clock,
          logger,
        }),
    ).not.toThrow();
  });
});
