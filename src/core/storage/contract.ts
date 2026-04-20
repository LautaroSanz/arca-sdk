import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { AccessTicket } from "../wsaa/access-ticket";
import type { TicketStorage } from "./ticket-storage";

export interface ContractTestHooks {
  setup?: () => Promise<TicketStorage> | TicketStorage;
  teardown?: () => Promise<void> | void;
}

export function runTicketStorageContract(name: string, hooks: ContractTestHooks): void {
  describe(`${name} (TicketStorage contract)`, () => {
    let storage: TicketStorage;

    beforeEach(async () => {
      storage = await (hooks.setup?.() ?? Promise.reject(new Error("setup required")));
    });

    afterEach(async () => {
      await hooks.teardown?.();
    });

    const ticket: AccessTicket = {
      service: "wsfe",
      cuit: "20111111112",
      token: "tok",
      sign: "sig",
      generationTime: new Date("2099-01-01T00:00:00Z"),
      expirationTime: new Date("2099-01-01T12:00:00Z"),
      raw: "<xml/>",
    };

    it("returns null for missing ticket", async () => {
      const got = await storage.get("wsfe", "20111111112");
      expect(got).toBeNull();
    });

    it("stores and retrieves a ticket", async () => {
      await storage.set(ticket);
      const got = await storage.get("wsfe", "20111111112");
      expect(got).not.toBeNull();
      expect(got?.token).toBe("tok");
      expect(got?.expirationTime.toISOString()).toBe(ticket.expirationTime.toISOString());
    });

    it("isolates tickets by (service, cuit)", async () => {
      await storage.set(ticket);
      const other = await storage.get("wsfe", "99999999999");
      expect(other).toBeNull();
      const otherService = await storage.get("ws_sr_padron_a4", "20111111112");
      expect(otherService).toBeNull();
    });

    it("overwrites on set", async () => {
      await storage.set(ticket);
      await storage.set({ ...ticket, token: "updated" });
      const got = await storage.get("wsfe", "20111111112");
      expect(got?.token).toBe("updated");
    });

    it("delete removes the ticket", async () => {
      await storage.set(ticket);
      await storage.delete("wsfe", "20111111112");
      expect(await storage.get("wsfe", "20111111112")).toBeNull();
    });

    it("delete is idempotent", async () => {
      await expect(storage.delete("wsfe", "20111111112")).resolves.toBeUndefined();
      await expect(storage.delete("wsfe", "20111111112")).resolves.toBeUndefined();
    });

    it("returns null for expired tickets", async () => {
      const expired: AccessTicket = {
        ...ticket,
        generationTime: new Date("2000-01-01T00:00:00Z"),
        expirationTime: new Date("2000-01-01T12:00:00Z"),
      };
      await storage.set(expired);
      const got = await storage.get("wsfe", "20111111112");
      expect(got).toBeNull();
    });
  });
}
