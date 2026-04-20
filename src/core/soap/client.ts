import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as soap from "soap";
import { SoapError } from "../errors/soap";

export interface SoapClientOptions {
  wsdl: string | { url: string };
  endpoint: string;
  timeoutMs?: number;
}

export interface SoapClient {
  call<TOut = unknown>(method: string, args: unknown): Promise<TOut>;
}

type SoapMethodAsyncFn = (args: unknown) => Promise<unknown[]>;

async function resolveWsdl(
  wsdl: string | { url: string },
): Promise<{ wsdlPath: string; cleanup: () => Promise<void> }> {
  if (typeof wsdl === "string") {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arca-wsdl-"));
    const file = path.join(dir, "service.wsdl");
    await fs.writeFile(file, wsdl);
    return {
      wsdlPath: file,
      cleanup: async () => {
        await fs.rm(dir, { recursive: true, force: true });
      },
    };
  }
  return { wsdlPath: wsdl.url, cleanup: async () => {} };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, method: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new SoapError("SOAP.TIMEOUT", {
          message: `SOAP call timed out after ${timeoutMs}ms`,
          context: { method, timeoutMs },
        }),
      );
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export async function createSoapClient(opts: SoapClientOptions): Promise<SoapClient> {
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const { wsdlPath, cleanup } = await resolveWsdl(opts.wsdl);

  let client: soap.Client;
  try {
    client = await soap.createClientAsync(wsdlPath, { endpoint: opts.endpoint });
  } catch (err) {
    await cleanup();
    throw new SoapError("SOAP.WSDL_FAILED", {
      message: "Failed to create SOAP client from WSDL",
      cause: err,
      context: { endpoint: opts.endpoint },
    });
  }
  await cleanup();

  client.setEndpoint(opts.endpoint);

  return {
    async call<TOut = unknown>(method: string, args: unknown): Promise<TOut> {
      const record = client as unknown as Record<string, unknown>;
      const methodAsync = record[`${method}Async`];
      if (typeof methodAsync !== "function") {
        throw new SoapError("SOAP.METHOD_UNKNOWN", {
          message: `Method "${method}" not found on SOAP client`,
          context: { method },
        });
      }
      const invoke = methodAsync as SoapMethodAsyncFn;
      try {
        const result = await withTimeout(invoke.call(client, args), timeoutMs, method);
        return result[0] as TOut;
      } catch (err) {
        if (err instanceof SoapError) throw err;
        const fault = (
          err as { root?: { Envelope?: { Body?: { Fault?: unknown } } } }
        ).root?.Envelope?.Body?.Fault;
        if (fault) {
          throw new SoapError("SOAP.FAULT", {
            message: "SOAP fault returned by server",
            cause: err,
            context: { method, fault: fault as Record<string, unknown> },
          });
        }
        throw new SoapError("SOAP.NETWORK", {
          message: (err as { message?: string }).message ?? "SOAP transport error",
          cause: err,
          context: { method },
        });
      }
    },
  };
}
