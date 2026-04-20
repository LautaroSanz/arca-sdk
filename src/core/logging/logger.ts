export interface Logger {
  debug(msg: string, meta?: Record<string, unknown>): void;
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: readonly LogLevel[] = ["debug", "info", "warn", "error"] as const;
const SENSITIVE_KEYS = new Set(["token", "sign", "cert", "key", "password", "secret"]);

function sanitize(
  meta: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    cleaned[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return cleaned;
}

export const noopLogger: Logger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
};

export function consoleLogger(level: LogLevel = "info"): Logger {
  const minIdx = LEVELS.indexOf(level);

  const emit = (lvl: LogLevel, msg: string, meta?: Record<string, unknown>): void => {
    if (LEVELS.indexOf(lvl) < minIdx) return;
    const clean = sanitize(meta);
    const prefix = `[${lvl}] ${msg}`;
    switch (lvl) {
      case "debug":
        if (clean) console.debug(prefix, clean);
        else console.debug(prefix);
        return;
      case "info":
        if (clean) console.info(prefix, clean);
        else console.info(prefix);
        return;
      case "warn":
        if (clean) console.warn(prefix, clean);
        else console.warn(prefix);
        return;
      case "error":
        if (clean) console.error(prefix, clean);
        else console.error(prefix);
        return;
    }
  };

  return {
    debug: (msg, meta) => emit("debug", msg, meta),
    info: (msg, meta) => emit("info", msg, meta),
    warn: (msg, meta) => emit("warn", msg, meta),
    error: (msg, meta) => emit("error", msg, meta),
  };
}
