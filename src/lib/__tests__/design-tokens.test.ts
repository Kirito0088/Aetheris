import { describe, it, expect } from "vitest";
import {
  PRIMITIVE_COLORS,
  PRIMITIVE_FONT_SIZES,
  PRIMITIVE_SPACING,
  PRIMITIVE_RADIUS,
  SEMANTIC_COLORS,
  SEMANTIC_Z_INDEX,
  SEMANTIC_ELEVATION,
  MOTION_DURATION,
  MOTION_EASING,
  THREE_ENVIRONMENT_PRESETS,
  BREAKPOINTS,
} from "@/lib/design-tokens";

describe("Design Tokens", () => {
  describe("PRIMITIVE_COLORS", () => {
    it("has all required palette keys", () => {
      expect(PRIMITIVE_COLORS).toHaveProperty("neutral");
      expect(PRIMITIVE_COLORS).toHaveProperty("blue");
      expect(PRIMITIVE_COLORS).toHaveProperty("green");
      expect(PRIMITIVE_COLORS).toHaveProperty("amber");
      expect(PRIMITIVE_COLORS).toHaveProperty("red");
    });

    it("neutral palette values are valid HSL strings", () => {
      const hslPattern = /^hsla?\(/;
      Object.values(PRIMITIVE_COLORS.neutral).forEach((color) => {
        expect(color).toMatch(hslPattern);
      });
    });

    it("all color palettes contain valid HSL values", () => {
      const hslPattern = /^hsla?\(/;
      for (const palette of Object.values(PRIMITIVE_COLORS)) {
        for (const color of Object.values(palette)) {
          expect(color).toMatch(hslPattern);
        }
      }
    });
  });

  describe("PRIMITIVE_FONT_SIZES", () => {
    it("has expected sizes", () => {
      expect(PRIMITIVE_FONT_SIZES).toHaveProperty("xs");
      expect(PRIMITIVE_FONT_SIZES).toHaveProperty("base");
      expect(PRIMITIVE_FONT_SIZES).toHaveProperty("xl");
    });

    it("values are rem strings", () => {
      Object.values(PRIMITIVE_FONT_SIZES).forEach((size) => {
        expect(size).toMatch(/^\d+(\.\d+)?rem$/);
      });
    });
  });

  describe("PRIMITIVE_SPACING", () => {
    it("has zero value", () => {
      expect(PRIMITIVE_SPACING[0]).toBe("0px");
    });

    it("key spacing values follow expected pattern", () => {
      expect(PRIMITIVE_SPACING[2]).toBe("8px");
      expect(PRIMITIVE_SPACING[4]).toBe("16px");
      expect(PRIMITIVE_SPACING[8]).toBe("32px");
    });
  });

  describe("PRIMITIVE_RADIUS", () => {
    it("has none and full values", () => {
      expect(PRIMITIVE_RADIUS.none).toBe("0px");
      expect(PRIMITIVE_RADIUS.full).toBe("9999px");
    });
  });

  describe("MOTION_DURATION", () => {
    it("all values are non-negative numbers", () => {
      Object.values(MOTION_DURATION).forEach((duration) => {
        expect(typeof duration).toBe("number");
        expect(duration).toBeGreaterThanOrEqual(0);
      });
    });

    it("instant is exactly 0", () => {
      expect(MOTION_DURATION.instant).toBe(0);
    });

    it("has semantic duration keys", () => {
      expect(MOTION_DURATION).toHaveProperty("feedback");
      expect(MOTION_DURATION).toHaveProperty("context");
      expect(MOTION_DURATION).toHaveProperty("transition");
      expect(MOTION_DURATION).toHaveProperty("hero");
    });
  });

  describe("MOTION_EASING", () => {
    it("all easing arrays have exactly 4 elements (cubic bezier)", () => {
      Object.values(MOTION_EASING).forEach((easing) => {
        expect(easing).toHaveLength(4);
      });
    });

    it("all easing values are between 0 and 1", () => {
      Object.values(MOTION_EASING).forEach((easing) => {
        easing.forEach((value) => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe("SEMANTIC_Z_INDEX", () => {
    it("layers are ordered correctly", () => {
      expect(SEMANTIC_Z_INDEX.background).toBeLessThan(SEMANTIC_Z_INDEX.surface);
      expect(SEMANTIC_Z_INDEX.surface).toBeLessThan(SEMANTIC_Z_INDEX.content);
      expect(SEMANTIC_Z_INDEX.content).toBeLessThan(SEMANTIC_Z_INDEX.navigation);
      expect(SEMANTIC_Z_INDEX.navigation).toBeLessThan(SEMANTIC_Z_INDEX.overlay);
      expect(SEMANTIC_Z_INDEX.overlay).toBeLessThan(SEMANTIC_Z_INDEX.modal);
      expect(SEMANTIC_Z_INDEX.modal).toBeLessThan(SEMANTIC_Z_INDEX.tooltip);
      expect(SEMANTIC_Z_INDEX.tooltip).toBeLessThan(SEMANTIC_Z_INDEX.notification);
    });
  });

  describe("SEMANTIC_ELEVATION", () => {
    it("has levels 0 through 5", () => {
      expect(SEMANTIC_ELEVATION).toHaveProperty("0");
      expect(SEMANTIC_ELEVATION).toHaveProperty("1");
      expect(SEMANTIC_ELEVATION).toHaveProperty("2");
      expect(SEMANTIC_ELEVATION).toHaveProperty("3");
      expect(SEMANTIC_ELEVATION).toHaveProperty("4");
      expect(SEMANTIC_ELEVATION).toHaveProperty("5");
    });

    it("level 0 is none", () => {
      expect(SEMANTIC_ELEVATION[0]).toBe("none");
    });
  });

  describe("SEMANTIC_COLORS.crowd", () => {
    it("has all density levels", () => {
      expect(SEMANTIC_COLORS.crowd).toHaveProperty("low");
      expect(SEMANTIC_COLORS.crowd).toHaveProperty("medium");
      expect(SEMANTIC_COLORS.crowd).toHaveProperty("high");
      expect(SEMANTIC_COLORS.crowd).toHaveProperty("critical");
    });
  });

  describe("THREE_ENVIRONMENT_PRESETS", () => {
    it("has day, night, event, emergency", () => {
      expect(THREE_ENVIRONMENT_PRESETS.day).toBe("day");
      expect(THREE_ENVIRONMENT_PRESETS.night).toBe("night");
      expect(THREE_ENVIRONMENT_PRESETS.event).toBe("event");
      expect(THREE_ENVIRONMENT_PRESETS.emergency).toBe("emergency");
    });
  });

  describe("BREAKPOINTS", () => {
    it("has expected responsive breakpoint keys", () => {
      expect(BREAKPOINTS).toHaveProperty("xs");
      expect(BREAKPOINTS).toHaveProperty("sm");
      expect(BREAKPOINTS).toHaveProperty("md");
      expect(BREAKPOINTS).toHaveProperty("lg");
      expect(BREAKPOINTS).toHaveProperty("xl");
      expect(BREAKPOINTS).toHaveProperty("2xl");
    });
  });
});
