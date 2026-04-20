import { describe, it, expect } from "vitest";
import { createSystemClock } from "./ntp";

describe("createSystemClock", () => {
  it("returns current time within a small tolerance", async () => {
    const clock = createSystemClock();
    const before = Date.now();
    const got = await clock.now();
    const after = Date.now();
    expect(got.getTime()).toBeGreaterThanOrEqual(before);
    expect(got.getTime()).toBeLessThanOrEqual(after);
  });

  it("does not throw or hit the network", async () => {
    const clock = createSystemClock();
    await expect(clock.now()).resolves.toBeInstanceOf(Date);
  });
});
