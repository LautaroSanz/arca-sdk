import type { SoapClient } from "../../../core/soap/client";

export interface DummyResult {
  AppServer: "OK" | "NO";
  DbServer: "OK" | "NO";
  AuthServer: "OK" | "NO";
}

interface RawResponse {
  FEDummyResult?: DummyResult;
}

export async function dummy(client: SoapClient): Promise<DummyResult> {
  const res = await client.call<RawResponse>("FEDummy", {});
  return res.FEDummyResult ?? { AppServer: "NO", DbServer: "NO", AuthServer: "NO" };
}
