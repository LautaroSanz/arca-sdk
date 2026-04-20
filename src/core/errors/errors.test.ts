import { describe, it, expect } from "vitest";
import {
  ArcaError,
  ConfigError,
  CryptoError,
  WsaaError,
  SoapError,
  WsnError,
  WsfeError,
  TimeSkewError,
  isRetryable,
} from "./index";

describe("ArcaError hierarchy", () => {
  it("all concrete errors are instanceof ArcaError", () => {
    const errors = [
      new ConfigError("CONFIG.X"),
      new CryptoError("CRYPTO.X"),
      new WsaaError("WSAA.X"),
      new SoapError("SOAP.X"),
      new WsfeError("WSFE.X"),
      new TimeSkewError(),
    ];
    for (const e of errors) {
      expect(e).toBeInstanceOf(ArcaError);
      expect(e).toBeInstanceOf(Error);
    }
  });

  it("WsfeError is instanceof WsnError", () => {
    expect(new WsfeError("WSFE.X")).toBeInstanceOf(WsnError);
  });

  it("preserves cause (error chaining)", () => {
    const root = new Error("root");
    const err = new ConfigError("CONFIG.A", { cause: root });
    expect(err.cause).toBe(root);
  });

  it("name is the concrete class name", () => {
    expect(new ConfigError("CONFIG.X").name).toBe("ConfigError");
    expect(new WsfeError("WSFE.Y").name).toBe("WsfeError");
  });
});

describe("ArcaError.toJSON", () => {
  it("returns name, code, message (without stack)", () => {
    const err = new SoapError("SOAP.TIMEOUT", { message: "boom" });
    const json = err.toJSON() as Record<string, unknown>;
    expect(json).toEqual({
      name: "SoapError",
      code: "SOAP.TIMEOUT",
      message: "boom",
    });
    expect(json["stack"]).toBeUndefined();
  });

  it("includes context when provided", () => {
    const err = new WsaaError("WSAA.BAD_SIGN", {
      context: { service: "wsfe", cuit: "20XXXXXXXX" },
    });
    const json = err.toJSON() as { context: Record<string, unknown> };
    expect(json.context).toEqual({ service: "wsfe", cuit: "20XXXXXXXX" });
  });

  it("WsaaError.toJSON includes arcaCode", () => {
    const err = new WsaaError("WSAA.GENERIC", { arcaCode: "15000" });
    const json = err.toJSON() as { arcaCode: string };
    expect(json.arcaCode).toBe("15000");
  });
});

describe("sensitive data redaction", () => {
  it("redacts token/sign/cert/key/password from context", () => {
    const err = new ConfigError("CONFIG.X", {
      context: {
        cuit: "20",
        token: "secret-token",
        sign: "secret-sign",
        cert: "PEM",
        key: "PEM",
        password: "hunter2",
      },
    });
    const ctx = err.context as Record<string, string>;
    expect(ctx["cuit"]).toBe("20");
    expect(ctx["token"]).toBe("[REDACTED]");
    expect(ctx["sign"]).toBe("[REDACTED]");
    expect(ctx["cert"]).toBe("[REDACTED]");
    expect(ctx["key"]).toBe("[REDACTED]");
    expect(ctx["password"]).toBe("[REDACTED]");
  });
});

describe("isRetryable", () => {
  it("returns true for known retryable codes", () => {
    expect(isRetryable(new SoapError("SOAP.TIMEOUT"))).toBe(true);
    expect(isRetryable(new SoapError("SOAP.NETWORK"))).toBe(true);
    expect(isRetryable(new TimeSkewError())).toBe(true);
  });

  it("returns false for non-retryable SDK errors", () => {
    expect(isRetryable(new ConfigError("CONFIG.X"))).toBe(false);
    expect(isRetryable(new CryptoError("CRYPTO.X"))).toBe(false);
    expect(isRetryable(new WsaaError("WSAA.X"))).toBe(false);
    expect(isRetryable(new WsfeError("WSFE.X"))).toBe(false);
  });

  it("returns false for non-SDK errors", () => {
    expect(isRetryable(new Error("random"))).toBe(false);
    expect(isRetryable("string")).toBe(false);
    expect(isRetryable(null)).toBe(false);
    expect(isRetryable(undefined)).toBe(false);
  });
});
