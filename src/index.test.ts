import { describe, it, expect } from "vitest";
import { SDK_VERSION } from "./index";

describe("index", () => {
  it("exports SDK_VERSION", () => {
    expect(SDK_VERSION).toBe("0.0.0");
  });
});
