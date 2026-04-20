import { describe, it, expect } from "vitest";
import { buildTra } from "./tra-builder";

describe("buildTra", () => {
  it("produces valid XML with the required elements", () => {
    const now = new Date("2026-04-19T22:00:00-03:00");
    const tra = buildTra({ service: "wsfe", now });
    expect(tra).toContain("<loginTicketRequest");
    expect(tra).toContain("<uniqueId>");
    expect(tra).toContain("<generationTime>");
    expect(tra).toContain("<expirationTime>");
    expect(tra).toContain("<service>wsfe</service>");
  });

  it("uniqueId matches the epoch seconds of `now`", () => {
    const now = new Date("2026-04-19T22:00:00Z");
    const tra = buildTra({ service: "wsfe", now });
    const expected = Math.floor(now.getTime() / 1000);
    expect(tra).toContain(`<uniqueId>${expected}</uniqueId>`);
  });

  it("generationTime is 60 seconds before expirationTime window start", () => {
    const now = new Date("2026-04-19T22:00:00Z");
    const tra = buildTra({ service: "wsfe", now, ttlSeconds: 600 });
    const genMatch = /<generationTime>([^<]+)<\/generationTime>/.exec(tra);
    const expMatch = /<expirationTime>([^<]+)<\/expirationTime>/.exec(tra);
    expect(genMatch).not.toBeNull();
    expect(expMatch).not.toBeNull();
    const gen = new Date(genMatch![1]!);
    const exp = new Date(expMatch![1]!);
    expect(exp.getTime() - gen.getTime()).toBe((600 + 60) * 1000);
  });

  it("successive calls produce different uniqueId when `now` advances", () => {
    const a = buildTra({ service: "wsfe", now: new Date("2026-04-19T22:00:00Z") });
    const b = buildTra({ service: "wsfe", now: new Date("2026-04-19T22:00:05Z") });
    expect(a).not.toEqual(b);
  });

  it("respects custom ttlSeconds", () => {
    const now = new Date("2026-04-19T22:00:00Z");
    const tra = buildTra({ service: "wsfe", now, ttlSeconds: 1800 });
    const genMatch = /<generationTime>([^<]+)<\/generationTime>/.exec(tra);
    const expMatch = /<expirationTime>([^<]+)<\/expirationTime>/.exec(tra);
    const gen = new Date(genMatch![1]!);
    const exp = new Date(expMatch![1]!);
    expect(exp.getTime() - gen.getTime()).toBe((1800 + 60) * 1000);
  });

  it("escapes special characters in service name", () => {
    const tra = buildTra({ service: "foo&bar", now: new Date("2026-04-19T22:00:00Z") });
    expect(tra).toContain("<service>foo&amp;bar</service>");
  });
});
