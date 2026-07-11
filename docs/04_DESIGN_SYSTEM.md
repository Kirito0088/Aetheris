# 04 Design System

> **Purpose**: The definitive design bible for the Aetheris platform, covering all visual and interaction philosophies, tokens, and components.
> **Audience**: Design and Frontend Engineering Teams
> **Owner**: Design Team
> **Status**: Active
> **Version**: 3.0
> **Last Updated**: July 2026
> **Related Documents**: `01_PRODUCT_VISION.md`

## Overview
Aetheris must look and feel like an official FIFA product. The design philosophy is inspired by premium consumer and enterprise products (Apple, Stripe, Linear, Airbnb, Google Material 3 Expressive) combined with the high-legibility of FIFA Broadcast Graphics.

We avoid cyberpunk, military dashboard, terminal, or developer tooling aesthetics. We embrace calm under pressure, progressive disclosure, and premium finishing.

---

## Visual Foundations

### Typography
The typography system prioritizes extreme legibility across all environmental conditions (glare, motion, low light).
- **Primary Font**: Inter (or equivalent clean sans-serif).
- **Display Font**: FIFA official broadcast typeface (where applicable).
- **Hierarchy**: Strict scaling. Use clear contrasts in weight and size. Avoid overly thin weights.

### Color
Colors are functional, accessible, and grounded in reality.
- **Brand**: FIFA official palette integration.
- **Semantic**: 
  - *Success*: Calming greens.
  - *Warning*: High-visibility yellows/oranges.
  - *Critical/Incident*: High-contrast reds.
- **Backgrounds**: Pure, clean surfaces. Dark mode utilizes deep, rich tones rather than pure black to reduce eye strain.

### Spacing & Grid
- **Base Unit**: 4px/8px modular scale.
- **Grid**: Fluid 12-column grid system that adapts seamlessly from mobile devices (Fan/Volunteer) to large control room displays (Operations).
- **Density**: 
  - Mobile: Comfortable spacing for tap targets.
  - Desktop/Control Room: Higher information density without sacrificing clarity.

### Elevation & Glass
- **Elevation**: Used strictly to denote hierarchy and z-index importance. Shadows must be soft and diffused, never harsh.
- **Glass (Glassmorphism)**: Used sparingly for contextual overlays (like routing cards over the Venue Map) to maintain context without completely obscuring the background.

---

## Component Philosophy

### Cards
Cards are the primary vessel for intelligence. 
- They must be self-contained, actionable, and context-aware.
- Avoid overwhelming the user; employ progressive disclosure to hide secondary actions.

### Venue Map
The Venue Map is an operational canvas, not a technology showcase.
- It must clearly indicate routes, densities, and incident locations.
- It should abstract unnecessary physical details to emphasize operational data.

### Broadcast Graphics
Inspiration from sports broadcasting:
- High contrast, large legible numbers, and clear iconography.
- Data visualizations should be instantly readable at a glance.

---

## Interaction & Motion

### Interaction Rules
- **Calm Under Pressure**: Interactions must not be erratic or overly complex. Every tap/click should have a predictable, immediate outcome.
- **Feedback**: Every action must have an immediate visual acknowledgment.

### Animation Language & Framer Motion Rules
Motion is used to explain state changes, not for decoration.
- **Entrance**: Swift, smooth easing (e.g., `ease-out`).
- **Transitions**: State transitions must clarify where an element came from and where it is going.
- **Framer Motion**: Standardize around a shared set of motion variants. Avoid physics-based spring animations that feel overly bouncy or playful; opt for sophisticated, damped springs.

### Motion Tokens
- `duration-fast`: 150ms
- `duration-base`: 250ms
- `duration-slow`: 400ms
- `easing-standard`: `cubic-bezier(0.4, 0, 0.2, 1)`
- `easing-emphasized`: `cubic-bezier(0.2, 0, 0, 1)`

### ReactBits Usage Rules
Any usage of ReactBits or external animation libraries must be heavily audited for performance and aesthetic alignment. Complex animations that drop frames or feel "gimmicky" will be rejected.

---

## Usability

### Responsive Rules
- **Mobile First for Field**: Fans, Volunteers, and Security are mobile-first personas. The interface must be thumb-friendly and readable outdoors.
- **Desktop First for Control Room**: Operations and Future Admins require high-density, multi-panel desktop layouts.

### Accessibility
Accessibility is non-negotiable.
- Contrast ratios must meet WCAG AA standards minimum.
- Support for dynamic type sizing and screen readers.
- Motion must respect the user's `prefers-reduced-motion` settings.

### Illustrations & Icons
- **Icons**: Consistent stroke width, solid shapes for active states, highly recognizable metaphors.
- **Illustrations**: Minimal, purposeful, and aligned with the premium brand identity. Avoid generic corporate "tech" vectors.

---

## QA Checklist
Before any UI component is merged, it must pass:
- [ ] Conforms to typography and spacing tokens.
- [ ] Color contrast meets accessibility standards.
- [ ] Motion is purposeful and respects reduced motion preferences.
- [ ] Glass/Elevation layers do not cause performance degradation.
- [ ] Component is fully responsive across target devices for the intended persona.
- [ ] Aesthetic avoids "developer tooling" vibes and feels like a premium consumer product.
