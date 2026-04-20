import { ArcaError } from "./base";

const RETRYABLE_CODES: ReadonlySet<string> = new Set([
  "SOAP.TIMEOUT",
  "SOAP.NETWORK",
  "TIME.SKEW",
]);

export function isRetryable(err: unknown): boolean {
  if (!(err instanceof ArcaError)) return false;
  return RETRYABLE_CODES.has(err.code);
}
