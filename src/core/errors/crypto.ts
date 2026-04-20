import { ArcaError } from "./base";

export type CryptoErrorCode = `CRYPTO.${string}`;

export interface CryptoErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class CryptoError extends ArcaError {
  readonly code: CryptoErrorCode;

  constructor(code: CryptoErrorCode, opts: CryptoErrorOptions = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context,
    });
    this.code = code;
  }
}
