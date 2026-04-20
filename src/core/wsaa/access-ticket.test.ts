import { describe, it, expect } from "vitest";
import { type AccessTicket, isExpired, isAboutToExpire } from "./access-ticket";

function makeTicket(overrides: Partial<AccessTicket> = {}): AccessTicket {
  return {
    service: "wsfe",
    cuit: "20111111112",
    token: "tok",
    sign: "sig",
    generationTime: new Date("2026-04-19T10:00:00-03:00"),
    expirationTime: new Date("2026-04-19T22:00:00-03:00"),
    raw: "<xml/>",
    ...overrides,
  };
}

describe("isExpired", () => {
  it("returns false before expirationTime", () => {
    const ticket = makeTicket();
    const now = new Date("2026-04-19T21:59:00-03:00");
    expect(isExpired(ticket, now)).toBe(false);
  });

  it("returns true after expirationTime", () => {
    const ticket = makeTicket();
    const now = new Date("2026-04-19T23:00:00-03:00");
    expect(isExpired(ticket, now)).toBe(true);
  });

  it("returns false exactly at expirationTime", () => {
    const ticket = makeTicket();
    const now = new Date("2026-04-19T22:00:00-03:00");
    expect(isExpired(ticket, now)).toBe(false);
  });
});

describe("isAboutToExpire", () => {
  it("returns true 30s before expiry with 60s margin", () => {
    const exp = new Date("2026-04-19T22:00:00-03:00");
    const ticket = makeTicket({ expirationTime: exp });
    const now = new Date(exp.getTime() - 30_000);
    expect(isAboutToExpire(ticket, 60, now)).toBe(true);
  });

  it("returns false 5 minutes before expiry with 60s margin", () => {
    const exp = new Date("2026-04-19T22:00:00-03:00");
    const ticket = makeTicket({ expirationTime: exp });
    const now = new Date(exp.getTime() - 5 * 60_000);
    expect(isAboutToExpire(ticket, 60, now)).toBe(false);
  });

  it("returns true after expiration", () => {
    const exp = new Date("2026-04-19T22:00:00-03:00");
    const ticket = makeTicket({ expirationTime: exp });
    const now = new Date(exp.getTime() + 1000);
    expect(isAboutToExpire(ticket, 60, now)).toBe(true);
  });
});

describe("JSON serialization", () => {
  it("ticket round-trips through JSON with Date ISO strings", () => {
    const ticket = makeTicket();
    const serialized = JSON.stringify(ticket);
    const parsed = JSON.parse(serialized) as { generationTime: string };
    expect(parsed.generationTime).toBe(ticket.generationTime.toISOString());
  });
});
