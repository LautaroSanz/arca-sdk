import { describe, it, expect, vi } from "vitest";
import type { SoapClient } from "../../../core/soap/client";
import { dummy } from "./dummy";

function makeClient(response: unknown): { client: SoapClient; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn(async () => response);
  return { client: { call: call as unknown as SoapClient["call"] }, call };
}

describe("dummy (FEDummy)", () => {
  it("calls FEDummy with no args and unwraps FEDummyResult", async () => {
    const { client, call } = makeClient({
      FEDummyResult: { AppServer: "OK", DbServer: "OK", AuthServer: "OK" },
    });
    const result = await dummy(client);
    expect(call).toHaveBeenCalledWith("FEDummy", {});
    expect(result).toEqual({ AppServer: "OK", DbServer: "OK", AuthServer: "OK" });
  });

  it("forwards degraded statuses", async () => {
    const { client } = makeClient({
      FEDummyResult: { AppServer: "OK", DbServer: "NO", AuthServer: "OK" },
    });
    const result = await dummy(client);
    expect(result.DbServer).toBe("NO");
  });

  it("returns NO for all fields when response is empty", async () => {
    const { client } = makeClient({});
    const result = await dummy(client);
    expect(result).toEqual({ AppServer: "NO", DbServer: "NO", AuthServer: "NO" });
  });
});
