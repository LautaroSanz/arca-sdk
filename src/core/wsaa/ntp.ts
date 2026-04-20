import { NtpTimeSync } from "ntp-time-sync";
import { type Logger, noopLogger } from "../logging/logger";

export interface NtpClock {
  now(): Promise<Date>;
}

export interface NtpClockOptions {
  server?: string;
  logger?: Logger;
  cacheTtlSeconds?: number;
}

export function createSystemClock(): NtpClock {
  return { now: async () => new Date() };
}

export function createNtpClock(options: NtpClockOptions = {}): NtpClock {
  const server = options.server ?? "time.afip.gov.ar";
  const logger = options.logger ?? noopLogger;
  const cacheTtlMs = (options.cacheTtlSeconds ?? 300) * 1000;

  let cachedOffset: number | null = null;
  let cachedAt = 0;

  return {
    async now() {
      const sysNow = Date.now();
      if (cachedOffset !== null && sysNow - cachedAt < cacheTtlMs) {
        return new Date(sysNow + cachedOffset);
      }
      try {
        const sync = NtpTimeSync.getInstance({ servers: [server] });
        const result = await sync.getTime();
        const offset = result.offset;
        cachedOffset = offset;
        cachedAt = Date.now();
        return new Date(Date.now() + offset);
      } catch (err) {
        logger.warn("NTP sync failed, falling back to system clock", {
          server,
          error: String(err),
        });
        return new Date();
      }
    },
  };
}
