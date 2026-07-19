import { describe, it, expect } from "vitest";
import { formatNumber, formatNumberWithOptions } from "@/utils/format";

describe("formatNumber", () => {
  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("formats small integers without commas", () => {
    expect(formatNumber(42)).toBe("42");
  });

  it("formats thousands with commas", () => {
    expect(formatNumber(1000)).toBe("1,000");
  });

  it("formats large numbers with commas", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats negative numbers", () => {
    expect(formatNumber(-5000)).toBe("-5,000");
  });

  it("truncates decimals (maximumFractionDigits: 0)", () => {
    expect(formatNumber(3.14)).toBe("3");
  });
});

describe("formatNumberWithOptions", () => {
  it("formats with minimumFractionDigits", () => {
    const result = formatNumberWithOptions(42, { minimumFractionDigits: 2 });
    expect(result).toBe("42.00");
  });

  it("formats as currency", () => {
    const result = formatNumberWithOptions(1234.5, {
      style: "currency",
      currency: "USD",
    });
    expect(result).toContain("1,234.50");
  });

  it("formats as percent", () => {
    const result = formatNumberWithOptions(0.75, { style: "percent" });
    expect(result).toBe("75%");
  });

  it("uses default en-US locale", () => {
    const result = formatNumberWithOptions(1000);
    expect(result).toBe("1,000");
  });
});
