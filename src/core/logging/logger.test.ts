import { describe, it, expect, vi, afterEach } from "vitest";
import { noopLogger, consoleLogger } from "./logger";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("noopLogger", () => {
  it("does not throw on any level", () => {
    expect(() => {
      noopLogger.debug("x");
      noopLogger.info("x", { k: 1 });
      noopLogger.warn("x");
      noopLogger.error("x", { k: 1 });
    }).not.toThrow();
  });
});

describe("consoleLogger level filtering", () => {
  it("filters out debug when level is info", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logger = consoleLogger("info");
    logger.debug("dropped");
    expect(debugSpy).not.toHaveBeenCalled();
  });

  it("emits info when level is info", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const logger = consoleLogger("info");
    logger.info("visible");
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it("emits all when level is debug", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = consoleLogger("debug");
    logger.debug("a");
    logger.error("b");
    expect(debugSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("only emits error when level is error", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = consoleLogger("error");
    logger.warn("dropped");
    logger.error("kept");
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});

describe("consoleLogger meta sanitization", () => {
  it("redacts sensitive keys", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const logger = consoleLogger("info");
    logger.info("login", { cuit: "20", token: "abc", sign: "xyz" });
    expect(infoSpy).toHaveBeenCalledWith(
      "[info] login",
      expect.objectContaining({
        cuit: "20",
        token: "[REDACTED]",
        sign: "[REDACTED]",
      }),
    );
  });

  it("omits meta arg when meta is undefined", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const logger = consoleLogger("info");
    logger.info("no meta");
    expect(infoSpy).toHaveBeenCalledWith("[info] no meta");
    expect(infoSpy.mock.calls[0]).toHaveLength(1);
  });
});
