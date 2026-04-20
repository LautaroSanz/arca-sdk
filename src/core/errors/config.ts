import { ArcaError } from "./base";

export type ConfigErrorCode = `CONFIG.${string}`;

export interface ConfigErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class ConfigError extends ArcaError {
  readonly code: ConfigErrorCode;

  constructor(code: ConfigErrorCode, opts: ConfigErrorOptions = {}) {
    super({
      message: opts.message ?? code,
      cause: opts.cause,
      context: opts.context,
    });
    this.code = code;
  }
}
