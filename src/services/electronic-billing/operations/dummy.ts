import type { SoapClient } from "../../../core/soap/client";

export interface DummyResult {
  AppServer: "OK" | "NO";
  DbServer: "OK" | "NO";
  AuthServer: "OK" | "NO";
}

export async function dummy(client: SoapClient): Promise<DummyResult> {
  return client.call<DummyResult>("FEDummy", {});
}
