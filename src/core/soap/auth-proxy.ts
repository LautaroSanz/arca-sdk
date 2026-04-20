import type { SoapClient } from "./client";
import type { WsaaClient } from "../wsaa/client";

export interface AuthProxyOptions {
  soap: SoapClient;
  wsaa: WsaaClient;
  service: string;
  authParamName?: string;
  shouldAuthenticate?: (method: string) => boolean;
}

function defaultShouldAuthenticate(method: string): boolean {
  if (/^FEDummy$/i.test(method)) return false;
  if (/^Dummy$/i.test(method)) return false;
  if (/_Dummy$/i.test(method)) return false;
  return true;
}

export function withAuth(opts: AuthProxyOptions): SoapClient {
  const authParamName = opts.authParamName ?? "Auth";
  const shouldAuthenticate = opts.shouldAuthenticate ?? defaultShouldAuthenticate;

  return {
    async call<TOut = unknown>(method: string, args: unknown): Promise<TOut> {
      if (!shouldAuthenticate(method)) {
        return opts.soap.call<TOut>(method, args);
      }
      const ticket = await opts.wsaa.getTicket(opts.service);
      const authed = {
        ...((args as Record<string, unknown> | undefined) ?? {}),
        [authParamName]: {
          Token: ticket.token,
          Sign: ticket.sign,
          Cuit: ticket.cuit,
        },
      };
      return opts.soap.call<TOut>(method, authed);
    },
  };
}
