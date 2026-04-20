import { describe, it, expect, beforeAll } from "vitest";
import forge from "node-forge";
import { WsaaClient, type LoginCmsFn } from "./client";
import { MemoryTicketStorage } from "../storage/memory-storage";
import { WsaaError } from "../errors/wsaa";

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

function fakeLoginResponse(expInFuture = true): string {
  const now = new Date();
  const exp = expInFuture
    ? new Date(now.getTime() + 12 * 3600 * 1000)
    : new Date(now.getTime() - 1000);
  return `<?xml version="1.0"?>
<loginTicketResponse version="1.0">
  <header>
    <generationTime>${now.toISOString()}</generationTime>
    <expirationTime>${exp.toISOString()}</expirationTime>
  </header>
  <credentials>
    <token>fake-token</token>
    <sign>fake-sign</sign>
  </credentials>
</loginTicketResponse>`;
}

describe("WsaaClient.getTicket", () => {
  it("returns a ticket on successful loginCms", async () => {
    const storage = new MemoryTicketStorage();
    const loginCmsFn: LoginCmsFn = async () => fakeLoginResponse();
    const client = new WsaaClient({
      cuit: "20111111112",
      cert,
      key,
      environment: "testing",
      storage,
      clock: { now: async () => new Date() },
      loginCmsFn,
    });
    const ticket = await client.getTicket("wsfe");
    expect(ticket.token).toBe("fake-token");
    expect(ticket.sign).toBe("fake-sign");
    expect(ticket.cuit).toBe("20111111112");
    expect(ticket.service).toBe("wsfe");
  });

  it("does not call loginCmsFn twice if ticket is cached and valid", async () => {
    const storage = new MemoryTicketStorage();
    let calls = 0;
    const loginCmsFn: LoginCmsFn = async () => {
      calls++;
      return fakeLoginResponse();
    };
    const client = new WsaaClient({
      cuit: "20111111112",
      cert,
      key,
      environment: "testing",
      storage,
      clock: { now: async () => new Date() },
      loginCmsFn,
    });
    await client.getTicket("wsfe");
    await client.getTicket("wsfe");
    expect(calls).toBe(1);
  });

  it("throws WsaaError on empty response", async () => {
    const loginCmsFn: LoginCmsFn = async () => "";
    const client = new WsaaClient({
      cuit: "20111111112",
      cert,
      key,
      environment: "testing",
      clock: { now: async () => new Date() },
      loginCmsFn,
    });
    await expect(client.getTicket("wsfe")).rejects.toBeInstanceOf(WsaaError);
  });

  it("throws WsaaError on missing fields", async () => {
    const loginCmsFn: LoginCmsFn = async () =>
      `<?xml version="1.0"?><loginTicketResponse><header/></loginTicketResponse>`;
    const client = new WsaaClient({
      cuit: "20111111112",
      cert,
      key,
      environment: "testing",
      clock: { now: async () => new Date() },
      loginCmsFn,
    });
    await expect(client.getTicket("wsfe")).rejects.toThrow(WsaaError);
  });

  it("maps SOAP fault with 'vigente' to WSAA.TICKET_STILL_VALID", async () => {
    const loginCmsFn: LoginCmsFn = async () => {
      throw {
        root: {
          Envelope: {
            Body: {
              Fault: { faultstring: "El TA se encuentra vigente" },
            },
          },
        },
      };
    };
    const client = new WsaaClient({
      cuit: "20111111112",
      cert,
      key,
      environment: "testing",
      clock: { now: async () => new Date() },
      loginCmsFn,
    });
    try {
      await client.getTicket("wsfe");
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WsaaError);
      expect((err as WsaaError).code).toBe("WSAA.TICKET_STILL_VALID");
    }
  });
});
