import { describe, it, expect } from "vitest";
import {
  transitionStandard,
  transitionFast,
  transitionSlow,
  transitionCinematic,
  transitionSpring,
  transitionFeedback,
  transitionContext,
  transitionTransition,
  transitionHero,
  fadeVariants,
  slideUpVariants,
  slideDownVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
  scaleVariants,
  staggerContainerVariants,
  pageVariants,
  overlayVariants,
} from "@/lib/motion";

describe("Motion System", () => {
  describe("transition presets", () => {
    const durationTransitions = [
      { name: "transitionStandard", value: transitionStandard },
      { name: "transitionFast", value: transitionFast },
      { name: "transitionSlow", value: transitionSlow },
      { name: "transitionCinematic", value: transitionCinematic },
      { name: "transitionFeedback", value: transitionFeedback },
      { name: "transitionContext", value: transitionContext },
      { name: "transitionTransition", value: transitionTransition },
      { name: "transitionHero", value: transitionHero },
    ];

    it.each(durationTransitions)(
      "$name has a positive duration",
      ({ value }) => {
        expect(value.duration).toBeGreaterThan(0);
      },
    );

    it("transitionSpring has spring type with physics properties", () => {
      expect(transitionSpring.type).toBe("spring");
      expect(transitionSpring).toHaveProperty("stiffness");
      expect(transitionSpring).toHaveProperty("damping");
      expect(transitionSpring).toHaveProperty("mass");
    });
  });

  describe("fadeVariants", () => {
    it("has hidden, visible, and exit keys", () => {
      expect(fadeVariants).toHaveProperty("hidden");
      expect(fadeVariants).toHaveProperty("visible");
      expect(fadeVariants).toHaveProperty("exit");
    });

    it("hidden state has opacity 0", () => {
      expect((fadeVariants.hidden as Record<string, number>).opacity).toBe(0);
    });
  });

  describe("slide variants", () => {
    const slideVariantSets = [
      { name: "slideUpVariants", value: slideUpVariants },
      { name: "slideDownVariants", value: slideDownVariants },
      { name: "slideInFromLeftVariants", value: slideInFromLeftVariants },
      { name: "slideInFromRightVariants", value: slideInFromRightVariants },
    ];

    it.each(slideVariantSets)(
      "$name has hidden, visible, and exit keys",
      ({ value }) => {
        expect(value).toHaveProperty("hidden");
        expect(value).toHaveProperty("visible");
        expect(value).toHaveProperty("exit");
      },
    );

    it("slideUpVariants.hidden has y=16", () => {
      expect((slideUpVariants.hidden as Record<string, number>).y).toBe(16);
    });

    it("slideDownVariants.hidden has y=-16", () => {
      expect((slideDownVariants.hidden as Record<string, number>).y).toBe(-16);
    });
  });

  describe("scaleVariants", () => {
    it("hidden state has scale=0.96", () => {
      expect((scaleVariants.hidden as Record<string, number>).scale).toBe(0.96);
    });
  });

  describe("staggerContainerVariants", () => {
    it("visible transition has staggerChildren > 0", () => {
      const visible = staggerContainerVariants.visible as Record<string, unknown>;
      const transition = visible.transition as Record<string, number>;
      expect(transition.staggerChildren).toBeGreaterThan(0);
    });
  });

  describe("pageVariants", () => {
    it("has initial, enter, and exit keys", () => {
      expect(pageVariants).toHaveProperty("initial");
      expect(pageVariants).toHaveProperty("enter");
      expect(pageVariants).toHaveProperty("exit");
    });
  });

  describe("overlayVariants", () => {
    it("has hidden, visible, and exit keys", () => {
      expect(overlayVariants).toHaveProperty("hidden");
      expect(overlayVariants).toHaveProperty("visible");
      expect(overlayVariants).toHaveProperty("exit");
    });
  });
});
