import { describe, it, expect } from "vitest";
import {
  cn,
  isDefined,
  isNonEmptyString,
  assertDefined,
  formatPercentage,
  truncate,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    const result = cn("px-4", "px-2");
    expect(result).toBe("px-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active")).toBe("base active");
    expect(cn("base", false && "active")).toBe("base");
  });

  it("handles falsy values (null, undefined, false)", () => {
    expect(cn("base", null, undefined, false)).toBe("base");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});

describe("isDefined", () => {
  it("returns false for null", () => {
    expect(isDefined(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it("returns true for 0", () => {
    expect(isDefined(0)).toBe(true);
  });

  it("returns true for empty string", () => {
    expect(isDefined("")).toBe(true);
  });

  it("returns true for false", () => {
    expect(isDefined(false)).toBe(true);
  });

  it("returns true for objects", () => {
    expect(isDefined({ key: "value" })).toBe(true);
  });
});

describe("isNonEmptyString", () => {
  it("returns false for empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(isNonEmptyString("   ")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isNonEmptyString(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isNonEmptyString(undefined)).toBe(false);
  });

  it("returns false for numbers", () => {
    expect(isNonEmptyString(42)).toBe(false);
  });

  it("returns true for non-empty strings", () => {
    expect(isNonEmptyString("hello")).toBe(true);
  });

  it("returns true for strings with leading/trailing spaces", () => {
    expect(isNonEmptyString("  hello  ")).toBe(true);
  });
});

describe("assertDefined", () => {
  it("throws for null with descriptive message", () => {
    expect(() => assertDefined(null, "value is required")).toThrowError(
      "Assertion failed: value is required",
    );
  });

  it("throws for undefined with descriptive message", () => {
    expect(() => assertDefined(undefined, "missing")).toThrowError(
      "Assertion failed: missing",
    );
  });

  it("does not throw for valid values", () => {
    expect(() => assertDefined("hello", "msg")).not.toThrow();
  });

  it("does not throw for 0", () => {
    expect(() => assertDefined(0, "msg")).not.toThrow();
  });

  it("does not throw for empty string", () => {
    expect(() => assertDefined("", "msg")).not.toThrow();
  });

  it("does not throw for false", () => {
    expect(() => assertDefined(false, "msg")).not.toThrow();
  });
});

describe("formatPercentage", () => {
  it("formats integer percentages", () => {
    expect(formatPercentage(50)).toBe("50%");
  });

  it("clamps negative values to 0", () => {
    expect(formatPercentage(-10)).toBe("0%");
  });

  it("clamps values above 100 to 100", () => {
    expect(formatPercentage(150)).toBe("100%");
  });

  it("handles 0 correctly", () => {
    expect(formatPercentage(0)).toBe("0%");
  });

  it("handles 100 correctly", () => {
    expect(formatPercentage(100)).toBe("100%");
  });

  it("supports decimal places", () => {
    expect(formatPercentage(33.333, 2)).toBe("33.33%");
  });

  it("rounds decimals correctly", () => {
    expect(formatPercentage(99.999, 1)).toBe("100.0%");
  });
});

describe("truncate", () => {
  it("returns original string if within limit", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("truncates long strings with ellipsis", () => {
    const result = truncate("This is a very long string", 10);
    expect(result).toBe("This is a…");
    expect(result.length).toBe(10);
  });

  it("handles exact boundary length", () => {
    expect(truncate("exact", 5)).toBe("exact");
  });

  it("handles single character max length", () => {
    expect(truncate("hello", 1)).toBe("…");
  });
});
