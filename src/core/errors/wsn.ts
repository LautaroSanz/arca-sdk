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

export type WsPadronErrorCode = `PADRON.${string}`;

export interface WsPadronErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class WsPadronError extends WsnError {
  readonly code: WsPadronErrorCode;

  constructor(code: WsPadronErrorCode, opts: WsPadronErrorOptions = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context,
    });
    this.code = code;
  }
}
