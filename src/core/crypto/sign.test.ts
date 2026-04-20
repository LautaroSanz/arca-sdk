import { describe, it, expect, beforeAll } from "vitest";
import forge from "node-forge";
import { signCms } from "./sign";
import { CryptoError } from "../errors/crypto";

let cert = "";
let key = "";

beforeAll(() => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
  const x509 = forge.pki.createCertificate();
  x509.publicKey = keypair.publicKey;
  x509.serialNumber = "01";
  x509.validity.notBefore = new Date();
  x509.validity.notAfter = new Date(Date.now() + 365 * 24 * 3600 * 1000);
  const attrs = [{ name: "commonName", value: "arca-sdk-test" }];
  x509.setSubject(attrs);
  x509.setIssuer(attrs);
  x509.sign(keypair.privateKey, forge.md.sha256.create());
  cert = forge.pki.certificateToPem(x509);
  key = forge.pki.privateKeyToPem(keypair.privateKey);
});

describe("signCms", () => {
  it("produces a non-empty base64 CMS", () => {
    const result = signCms({ content: "<tra/>", cert, key });
    expect(result.base64).toBeTruthy();
    const der = Buffer.from(result.base64, "base64");
    expect(der.length).toBeGreaterThan(100);
  });

  it("output is valid base64", () => {
    const result = signCms({ content: "<tra/>", cert, key });
    expect(result.base64).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it("different content produces different signatures", () => {
    const a = signCms({ content: "<a/>", cert, key });
    const b = signCms({ content: "<b/>", cert, key });
    expect(a.base64).not.toBe(b.base64);
  });

  it("throws CryptoError.CERT_INVALID on malformed cert", () => {
    try {
      signCms({ content: "x", cert: "NOT A PEM", key });
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(CryptoError);
      expect((err as CryptoError).code).toBe("CRYPTO.CERT_INVALID");
    }
  });

  it("throws CryptoError.KEY_INVALID on malformed key", () => {
    try {
      signCms({ content: "x", cert, key: "NOT A PEM" });
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(CryptoError);
      expect((err as CryptoError).code).toBe("CRYPTO.KEY_INVALID");
    }
  });
});
