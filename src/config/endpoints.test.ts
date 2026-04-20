import { describe, it, expect } from "vitest";
import { ENDPOINTS, type Environment } from "./endpoints";

describe("ENDPOINTS", () => {
  const envs: Environment[] = ["testing", "production"];

  it("exposes both environments", () => {
    expect(Object.keys(ENDPOINTS).sort()).toEqual(["production", "testing"]);
  });

  it("both environments share the same keys", () => {
    const testingKeys = Object.keys(ENDPOINTS.testing).sort();
    const productionKeys = Object.keys(ENDPOINTS.production).sort();
    expect(testingKeys).toEqual(productionKeys);
  });

  it("includes wscdc in both environments", () => {
    expect(ENDPOINTS.testing.wscdc).toContain("WSCDC");
    expect(ENDPOINTS.production.wscdc).toContain("WSCDC");
  });

  it.each(envs)("all URLs for %s point to afip (gov.ar or gob.ar)", (env) => {
    for (const url of Object.values(ENDPOINTS[env])) {
      expect(url).toMatch(/afip\.go[vb]\.ar/);
    }
  });

  it("testing endpoints contain 'homo'", () => {
    expect(ENDPOINTS.testing.wsaa).toContain("homo");
    expect(ENDPOINTS.testing.wsfev1).toContain("homo");
    expect(ENDPOINTS.testing.padronA4).toContain("homo");
  });

  it("production endpoints do not contain 'homo'", () => {
    expect(ENDPOINTS.production.wsaa).not.toContain("homo");
    expect(ENDPOINTS.production.wsfev1).not.toContain("homo");
    expect(ENDPOINTS.production.padronA4).not.toContain("homo");
  });
});
