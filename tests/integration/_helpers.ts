import { readFileSync, existsSync } from "node:fs";
import { Arca, type ArcaOptions } from "../../src/index";

export const INTEGRATION_ENABLED = process.env["ARCA_INTEGRATION"] === "1";
export const EMIT_REAL_ENABLED = process.env["ARCA_EMIT_REAL"] === "1";

export interface TestCreds {
  cuit: string;
  cert: string;
  key: string;
  environment: "testing" | "production";
}

function resolveCertOrKey(
  inlineEnv: string,
  pathEnv: string,
): string | null {
  const inline = process.env[inlineEnv];
  if (inline) return inline;
  const path = process.env[pathEnv];
  if (path && existsSync(path)) return readFileSync(path, "utf8");
  return null;
}

export function hasIntegrationConfig(): boolean {
  if (!INTEGRATION_ENABLED) return false;
  if (!process.env["ARCA_TEST_CUIT"]) return false;
  const cert = resolveCertOrKey("ARCA_TEST_CERT", "ARCA_TEST_CERT_PATH");
  const key = resolveCertOrKey("ARCA_TEST_KEY", "ARCA_TEST_KEY_PATH");
  return Boolean(cert && key);
}

export function readCreds(): TestCreds {
  const cuit = process.env["ARCA_TEST_CUIT"];
  if (!cuit) throw new Error("ARCA_TEST_CUIT env var missing");
  const cert = resolveCertOrKey("ARCA_TEST_CERT", "ARCA_TEST_CERT_PATH");
  const key = resolveCertOrKey("ARCA_TEST_KEY", "ARCA_TEST_KEY_PATH");
  if (!cert) throw new Error("Set ARCA_TEST_CERT or ARCA_TEST_CERT_PATH");
  if (!key) throw new Error("Set ARCA_TEST_KEY or ARCA_TEST_KEY_PATH");
  return { cuit, cert, key, environment: "testing" };
}

export function buildTestArca(overrides: Partial<ArcaOptions> = {}): Arca {
  const creds = readCreds();
  return new Arca({ ...creds, ...overrides });
}

export function todayYyyymmdd(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
