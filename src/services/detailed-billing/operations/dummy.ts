import type { SoapClient } from "../../../core/soap/client";

export interface MtxcaDummyResult {
  appserver: "OK" | "NO";
  dbserver: "OK" | "NO";
  authserver: "OK" | "NO";
}

interface RawResponse {
  return?: MtxcaDummyResult;
}

export async function mtxcaDummy(client: SoapClient): Promise<MtxcaDummyResult> {
  const res = await client.call<RawResponse>("dummy", {});
  return res.return ?? { appserver: "NO", dbserver: "NO", authserver: "NO" };
}
