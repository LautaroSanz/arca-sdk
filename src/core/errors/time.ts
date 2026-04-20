import { ArcaError } from "./base";

export interface TimeSkewErrorOptions {
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class TimeSkewError extends ArcaError {
  readonly code = "TIME.SKEW" as const;

  constructor(opts: TimeSkewErrorOptions = {}) {
    super({
      message: opts.message ?? "TIME.SKEW",
      cause: opts.cause,
      context: opts.context,
    });
  }
}
