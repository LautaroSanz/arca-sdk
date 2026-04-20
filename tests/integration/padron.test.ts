import { describe, it, expect } from "vitest";
import { buildTestArca, hasIntegrationConfig, readCreds } from "./_helpers";

describe.skipIf(!hasIntegrationConfig())("Padron integration (read-only lookup)", () => {
  it(
    "Padron A4: resolves own CUIT",
    async () => {
      const creds = readCreds();
      const arca = buildTestArca();
      const persona = await arca.register.personaA4(creds.cuit);
      expect(persona.idPersona).toBeGreaterThan(0);
      expect(["FISICA", "JURIDICA"]).toContain(persona.tipoPersona);
      expect(persona.tipoClave).toBeTruthy();
      expect(persona.estadoClave).toBeTruthy();
    },
    30_000,
  );

  it(
    "Padron A13: resolves own CUIT with richer data",
    async () => {
      const creds = readCreds();
      const arca = buildTestArca();
      const persona = await arca.register.personaA13(creds.cuit);
      expect(persona.idPersona).toBeGreaterThan(0);
      expect(persona.tipoClave).toBeTruthy();
    },
    30_000,
  );
});
