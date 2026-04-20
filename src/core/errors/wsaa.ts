import { ArcaError } from "./base";

export type WsaaErrorCode = `WSAA.${string}`;

export interface WsaaErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
  arcaCode?: string;
}

export class WsaaError extends ArcaError {
  readonly code: WsaaErrorCode;
  readonly arcaCode?: string;

  constructor(code: WsaaErrorCode, opts: WsaaErrorOptions = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context,
    });
    this.code = code;
    this.arcaCode = opts.arcaCode;
  }

  override toJSON(): object {
    const base = super.toJSON();
    return this.arcaCode ? { ...base, arcaCode: this.arcaCode } : base;
  }
}
