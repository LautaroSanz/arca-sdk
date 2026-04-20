import { describe, it, expect } from "vitest";
import { buildTestArca, hasIntegrationConfig } from "./_helpers";

describe.skipIf(!hasIntegrationConfig())("WSCDC integration (read-only ops)", () => {
  it(
    "ComprobanteDummy returns server statuses",
    async () => {
      const arca = buildTestArca();
      const result = await arca.verification.dummy();
      expect(["OK", "NO"]).toContain(result.AppServer);
      expect(["OK", "NO"]).toContain(result.DbServer);
      expect(["OK", "NO"]).toContain(result.AuthServer);
    },
    30_000,
  );
});
