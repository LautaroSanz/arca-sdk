import type { SoapClient } from "../../../core/soap/client";

export interface CdcDummyResult {
  AppServer: "OK" | "NO";
  DbServer: "OK" | "NO";
  AuthServer: "OK" | "NO";
}

interface RawResponse {
  ComprobanteDummyResult?: CdcDummyResult;
}

export async function cdcDummy(client: SoapClient): Promise<CdcDummyResult> {
  const res = await client.call<RawResponse>("ComprobanteDummy", {});
  return res.ComprobanteDummyResult ?? { AppServer: "NO", DbServer: "NO", AuthServer: "NO" };
}
