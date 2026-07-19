import { describe, it, expect } from "vitest";
import { sanitizeInput } from "@/app/actions/intelligence";

describe("sanitizeInput", () => {
  it("returns clean string unchanged", () => {
    expect(sanitizeInput("Hello World")).toBe("Hello World");
  });

  it("strips control characters", () => {
    expect(sanitizeInput("Hello\x00World")).toBe("HelloWorld");
    expect(sanitizeInput("Test\x08String")).toBe("TestString");
    expect(sanitizeInput("\x0BHidden\x0C")).toBe("Hidden");
  });

  it("removes triple backticks (prompt injection defense)", () => {
    expect(sanitizeInput("```json\n{hack}```")).toBe("json\n{hack}");
  });

  it("truncates to default maxLength of 500", () => {
    const longString = "a".repeat(600);
    const result = sanitizeInput(longString);
    expect(result.length).toBeLessThanOrEqual(500);
  });

  it("truncates to custom maxLength", () => {
    const result = sanitizeInput("Hello World", 5);
    expect(result).toBe("Hello");
  });

  it("trims leading and trailing whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("handles string at exact maxLength boundary", () => {
    const exact = "a".repeat(500);
    expect(sanitizeInput(exact)).toBe(exact);
  });

  it("handles mixed control chars, backticks, and whitespace", () => {
    const dirty = "  \x00Hello```World\x08  ";
    const result = sanitizeInput(dirty);
    expect(result).toBe("HelloWorld");
  });
});
