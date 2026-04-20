import { describe, it, expect } from "vitest";
import { WsaaClient } from "../../src/core/wsaa/client";
import { MemoryTicketStorage } from "../../src/core/storage/memory-storage";
import { hasIntegrationConfig, readCreds } from "./_helpers";

describe.skipIf(!hasIntegrationConfig())(
  "WSAA integration (real ARCA homologacion)",
  () => {
    it(
      "obtains a valid access ticket for wsfe",
      async () => {
        const creds = readCreds();
        const wsaa = new WsaaClient({
          ...creds,
          storage: new MemoryTicketStorage(),
        });
        const ticket = await wsaa.getTicket("wsfe");
        expect(ticket.token).toBeTruthy();
        expect(ticket.sign).toBeTruthy();
        expect(ticket.cuit).toBe(creds.cuit);
        expect(ticket.service).toBe("wsfe");
        expect(ticket.expirationTime.getTime()).toBeGreaterThan(Date.now());
      },
      30_000,
    );

    it(
      "reuses cached ticket on second call",
      async () => {
        const creds = readCreds();
        const wsaa = new WsaaClient({
          ...creds,
          storage: new MemoryTicketStorage(),
        });
        const t1 = await wsaa.getTicket("wsfe");
        const t2 = await wsaa.getTicket("wsfe");
        expect(t2.token).toBe(t1.token);
        expect(t2.sign).toBe(t1.sign);
      },
      60_000,
    );
  },
);
