import type { SoapClient } from "../../../core/soap/client";

export interface FexDummyResult {
  AppServer: "OK" | "NO";
  DbServer: "OK" | "NO";
  AuthServer: "OK" | "NO";
}

interface RawResponse {
  FEXDummyResult?: FexDummyResult;
}

export async function fexDummy(client: SoapClient): Promise<FexDummyResult> {
  const res = await client.call<RawResponse>("FEXDummy", {});
  return (
    res.FEXDummyResult ?? {
      AppServer: "NO",
      DbServer: "NO",
      AuthServer: "NO",
    }
  );
}
