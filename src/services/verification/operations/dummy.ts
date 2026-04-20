import type { SoapClient } from "../../../core/soap/client";

export interface CdcDummyResult {
  AppServer: "OK" | "NO";
  DbServer: "OK" | "NO";
  AuthServer: "OK" | "NO";
}

export async function cdcDummy(client: SoapClient): Promise<CdcDummyResult> {
  return client.call<CdcDummyResult>("ComprobanteDummy", {});
}
