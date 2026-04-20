import { describe, it, expect } from "vitest";
import { MemoryTicketStorage } from "./memory-storage";
import { runTicketStorageContract } from "./contract";
import type { AccessTicket } from "../wsaa/access-ticket";

runTicketStorageContract("MemoryTicketStorage", {
  setup: () => new MemoryTicketStorage(),
});

describe("MemoryTicketStorage isolation", () => {
  it("two instances do not share state", async () => {
    const a = new MemoryTicketStorage();
    const b = new MemoryTicketStorage();
    const ticket: AccessTicket = {
      service: "wsfe",
      cuit: "20111111112",
      token: "tok",
      sign: "sig",
      generationTime: new Date("2099-01-01T00:00:00Z"),
      expirationTime: new Date("2099-01-01T12:00:00Z"),
      raw: "<xml/>",
    };
    await a.set(ticket);
    expect(await b.get("wsfe", "20111111112")).toBeNull();
  });
});
