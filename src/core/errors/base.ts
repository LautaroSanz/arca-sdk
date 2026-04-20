export interface ArcaErrorOptions {
  message: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

const SENSITIVE_KEYS = new Set(["token", "sign", "cert", "key", "password", "secret"]);

function sanitizeContext(
  ctx: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!ctx) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(ctx)) {
    cleaned[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return cleaned;
}

export abstract class ArcaError extends Error {
  abstract readonly code: string;
  override readonly cause?: unknown;
  readonly context?: Record<string, unknown>;

  constructor(opts: ArcaErrorOptions) {
    super(opts.message);
    this.name = this.constructor.name;
    this.cause = opts.cause;
    this.context = sanitizeContext(opts.context);
  }

  toJSON(): object {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...(this.context ? { context: this.context } : {}),
    };
  }
}
