import { describe, it, expect, vi } from "vitest";
import { withAuth } from "./auth-proxy";
import type { SoapClient } from "./client";
import type { WsaaClient } from "../wsaa/client";
import type { AccessTicket } from "../wsaa/access-ticket";
import { WsaaError } from "../errors/wsaa";

function fakeTicket(overrides: Partial<AccessTicket> = {}): AccessTicket {
  return {
    service: "wsfe",
    cuit: "20111111112",
    token: "tok",
    sign: "sig",
    generationTime: new Date(),
    expirationTime: new Date(Date.now() + 3600_000),
    raw: "<xml/>",
    ...overrides,
  };
}

interface MockSoapClient {
  client: SoapClient;
  call: ReturnType<typeof vi.fn>;
}

function makeSoapClient(returnValue: unknown = { ok: true }): MockSoapClient {
  const call = vi.fn(async () => returnValue);
  return {
    client: { call: call as SoapClient["call"] },
    call,
  };
}

function makeWsaa(
  ticketOrError: AccessTicket | Error = fakeTicket(),
): { wsaa: WsaaClient; getTicket: ReturnType<typeof vi.fn> } {
  const getTicket = vi.fn(async () => {
    if (ticketOrError instanceof Error) throw ticketOrError;
    return ticketOrError;
  });
  return {
    wsaa: { getTicket } as unknown as WsaaClient,
    getTicket,
  };
}

describe("withAuth default shouldAuthenticate", () => {
  it("does not call wsaa for FEDummy", async () => {
    const { client, call } = makeSoapClient();
    const { wsaa, getTicket } = makeWsaa();
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe" });
    await proxy.call("FEDummy", {});
    expect(getTicket).not.toHaveBeenCalled();
    expect(call).toHaveBeenCalledWith("FEDummy", {});
  });

  it("does not call wsaa for exact 'Dummy' method", async () => {
    const { client, call } = makeSoapClient();
    const { wsaa, getTicket } = makeWsaa();
    const proxy = withAuth({ soap: client, wsaa, service: "ws_sr_padron_a4" });
    await proxy.call("Dummy", {});
    expect(getTicket).not.toHaveBeenCalled();
    expect(call).toHaveBeenCalledWith("Dummy", {});
  });

  it("does not call wsaa for methods ending in _Dummy", async () => {
    const { client } = makeSoapClient();
    const { wsaa, getTicket } = makeWsaa();
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe" });
    await proxy.call("Something_Dummy", {});
    expect(getTicket).not.toHaveBeenCalled();
  });

  it("adds Auth block for authenticated methods", async () => {
    const { client, call } = makeSoapClient();
    const { wsaa } = makeWsaa(fakeTicket({ token: "T", sign: "S", cuit: "20X" }));
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe" });
    await proxy.call("FECompUltimoAutorizado", { PtoVta: 1, CbteTipo: 6 });
    expect(call).toHaveBeenCalledWith("FECompUltimoAutorizado", {
      PtoVta: 1,
      CbteTipo: 6,
      Auth: { Token: "T", Sign: "S", Cuit: "20X" },
    });
  });

  it("handles undefined args gracefully", async () => {
    const { client, call } = makeSoapClient();
    const { wsaa } = makeWsaa();
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe" });
    await proxy.call("SomeMethod", undefined);
    expect(call).toHaveBeenCalledWith("SomeMethod", expect.objectContaining({ Auth: expect.any(Object) }));
  });
});

describe("withAuth custom options", () => {
  it("uses custom authParamName", async () => {
    const { client, call } = makeSoapClient();
    const { wsaa } = makeWsaa();
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe", authParamName: "Credentials" });
    await proxy.call("Method", {});
    expect(call).toHaveBeenCalledWith("Method", expect.objectContaining({ Credentials: expect.any(Object) }));
  });

  it("respects custom shouldAuthenticate", async () => {
    const { client } = makeSoapClient();
    const { wsaa, getTicket } = makeWsaa();
    const proxy = withAuth({
      soap: client,
      wsaa,
      service: "wsfe",
      shouldAuthenticate: () => false,
    });
    await proxy.call("EvenThisMethod", {});
    expect(getTicket).not.toHaveBeenCalled();
  });
});

describe("withAuth error handling", () => {
  it("propagates WSAA errors without calling SOAP", async () => {
    const { client, call } = makeSoapClient();
    const wsaaErr = new WsaaError("WSAA.FAULT", { message: "bad" });
    const { wsaa } = makeWsaa(wsaaErr);
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe" });
    await expect(proxy.call("Method", {})).rejects.toBe(wsaaErr);
    expect(call).not.toHaveBeenCalled();
  });

  it("does not mutate the original SoapClient", async () => {
    const { client, call } = makeSoapClient();
    const { wsaa } = makeWsaa();
    const proxy = withAuth({ soap: client, wsaa, service: "wsfe" });
    expect(proxy).not.toBe(client);
    await client.call("FEDummy", {});
    expect(call).toHaveBeenCalledTimes(1);
    await proxy.call("FEDummy", {});
    expect(call).toHaveBeenCalledTimes(2);
  });
});
