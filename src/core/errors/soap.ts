import { ArcaError } from "./base";

export type SoapErrorCode = `SOAP.${string}`;

export interface SoapErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class SoapError extends ArcaError {
  readonly code: SoapErrorCode;

  constructor(code: SoapErrorCode, opts: SoapErrorOptions = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context,
    });
    this.code = code;
  }
}
