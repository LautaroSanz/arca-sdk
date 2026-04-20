import { ArcaError } from "./base";

export abstract class WsnError extends ArcaError {}

export type WsfeErrorCode = `WSFE.${string}`;

export interface WsfeErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class WsfeError extends WsnError {
  readonly code: WsfeErrorCode;

  constructor(code: WsfeErrorCode, opts: WsfeErrorOptions = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context,
    });
    this.code = code;
  }
}
