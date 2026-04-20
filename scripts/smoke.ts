/**
 * Smoke test: verifica que el SDK puede llegar a ARCA homologacion.
 *
 * Llama los 4 endpoints "dummy" (healthcheck), que NO requieren cert
 * ni ticket WSAA — por eso este script se corre sin credenciales reales.
 *
 * Uso:
 *   pnpm run smoke
 *
 * Env vars opcionales:
 *   ARCA_ENV    "testing" | "production"  (default: testing)
 *   ARCA_CUIT   CUIT dummy solo para construir el objeto (default: 20000000000)
 */
import { Arca, type Environment } from "../src/index";

const env: Environment = (process.env["ARCA_ENV"] as Environment) ?? "testing";
const cuit = process.env["ARCA_CUIT"] ?? "20000000000";

const arca = new Arca({
  cuit,
  cert: "dummy-cert-not-used-for-dummies",
  key: "dummy-key-not-used-for-dummies",
  environment: env,
});

interface CheckResult {
  name: string;
  ok: boolean;
  detail: string;
  ms: number;
}

async function check(name: string, fn: () => Promise<unknown>): Promise<CheckResult> {
  const start = Date.now();
  try {
    const result = await fn();
    return { name, ok: true, detail: JSON.stringify(result), ms: Date.now() - start };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { name, ok: false, detail: msg, ms: Date.now() - start };
  }
}

async function main(): Promise<void> {
  console.log(`ARCA SDK smoke test — ambiente: ${env}`);
  console.log(`CUIT: ${cuit} (dummy — solo para construir el objeto)\n`);

  const checks: CheckResult[] = [];
  checks.push(await check("WSFEv1  (FEDummy)           ", () => arca.electronicBilling.dummy()));
  checks.push(await check("WSFEXv1 (FEXDummy)          ", () => arca.exportBilling.dummy()));
  checks.push(await check("WSMTXCA (dummy)             ", () => arca.detailedBilling.dummy()));
  checks.push(await check("WSCDC   (ComprobanteDummy)  ", () => arca.verification.dummy()));

  for (const c of checks) {
    const marker = c.ok ? "OK  " : "FAIL";
    console.log(`${marker}  ${c.name}  (${c.ms}ms)`);
    console.log(`        ${c.detail}\n`);
  }

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  console.log(`${passed}/${total} checks pasaron.`);

  if (passed < total) {
    console.log("\nSi alguno fallo, revisa conectividad a *.afip.gov.ar.");
    console.log("Errores de parseo SOAP pueden indicar que ARCA cambio el WSDL — abrir un issue.");
    process.exit(1);
  }
  console.log("\nTodo OK. El SDK puede comunicarse con ARCA.");
}

main().catch((err: unknown) => {
  console.error("Fallo inesperado:", err);
  process.exit(2);
});
