import { describe, it, expect } from "vitest";
import { createSoapClient } from "./client";
import { SoapError } from "../errors/soap";

describe("createSoapClient", () => {
  it("throws SoapError when WSDL load fails", async () => {
    await expect(
      createSoapClient({
        wsdl: { url: "http://127.0.0.1:1/does-not-exist?wsdl" },
        endpoint: "http://127.0.0.1:1/service",
        timeoutMs: 1000,
      }),
    ).rejects.toBeInstanceOf(SoapError);
  });

  it("throws SoapError with SOAP.WSDL_FAILED code on invalid inline WSDL", async () => {
    try {
      await createSoapClient({
        wsdl: "<this-is-not-valid-wsdl/>",
        endpoint: "http://example.test/svc",
      });
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(SoapError);
      expect((err as SoapError).code).toBe("SOAP.WSDL_FAILED");
    }
  });
});
