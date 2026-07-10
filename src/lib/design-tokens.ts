/**
 * Aetheris Design Tokens
 *
 * This file is the TypeScript implementation of the design token system
 * defined in DESIGN_TOKENS.md.
 *
 * Architecture: Primitive → Semantic → Component
 *
 * Rules (from DESIGN_TOKENS.md):
 * 1. Components never reference raw values.
 * 2. Components consume semantic tokens.
 * 3. Primitive tokens remain implementation details.
 * 4. New tokens require documentation.
 * 5. Hardcoded visual values are prohibited.
 */

// =============================================================================
// PRIMITIVE TOKENS
// Raw design values — never referenced directly by components.
// =============================================================================

/** Warm stone neutral palette — light-theme backbone (Phase 6). */
export const PRIMITIVE_COLORS = {
  neutral: {
    0: "hsl(0, 0%, 100%)",
    50: "hsl(40, 38%, 98%)",
    100: "hsl(40, 24%, 96%)",
    200: "hsl(36, 20%, 92%)",
    300: "hsl(34, 16%, 85%)",
    400: "hsl(32, 12%, 70%)",
    500: "hsl(30, 8%, 52%)",
    600: "hsl(28, 9%, 40%)",
    700: "hsl(25, 11%, 30%)",
    800: "hsl(24, 14%, 20%)",
    900: "hsl(24, 18%, 13%)",
    950: "hsl(24, 24%, 8%)",
  },
  blue: {
    50: "hsl(214, 100%, 97%)",
    100: "hsl(214, 95%, 93%)",
    200: "hsl(213, 94%, 87%)",
    300: "hsl(212, 92%, 78%)",
    400: "hsl(214, 90%, 66%)",
    500: "hsl(214, 86%, 55%)",
    600: "hsl(216, 84%, 48%)",
    700: "hsl(219, 80%, 41%)",
    800: "hsl(226, 71%, 40%)",
    900: "hsl(224, 64%, 33%)",
  },
  green: {
    50: "hsl(150, 60%, 96%)",
    100: "hsl(150, 62%, 90%)",
    200: "hsl(152, 60%, 80%)",
    300: "hsl(154, 62%, 66%)",
    400: "hsl(158, 68%, 48%)",
    500: "hsl(160, 84%, 39%)",
    600: "hsl(161, 88%, 31%)",
    700: "hsl(162, 84%, 25%)",
    800: "hsl(163, 78%, 20%)",
    900: "hsl(164, 74%, 16%)",
  },
  amber: {
    50: "hsl(45, 100%, 96%)",
    100: "hsl(45, 96%, 89%)",
    200: "hsl(44, 94%, 78%)",
    300: "hsl(43, 90%, 68%)",
    400: "hsl(43, 88%, 60%)",
    500: "hsl(41, 82%, 52%)",
    600: "hsl(36, 80%, 45%)",
    700: "hsl(30, 80%, 38%)",
    800: "hsl(25, 78%, 31%)",
    900: "hsl(22, 74%, 26%)",
  },
  red: {
    50: "hsl(0, 86%, 97%)",
    100: "hsl(0, 90%, 94%)",
    200: "hsl(0, 92%, 88%)",
    300: "hsl(0, 90%, 80%)",
    400: "hsl(0, 84%, 66%)",
    500: "hsl(0, 78%, 55%)",
    600: "hsl(0, 72%, 47%)",
    700: "hsl(0, 72%, 40%)",
    800: "hsl(0, 70%, 33%)",
    900: "hsl(0, 64%, 28%)",
  },
} as const;

/** Typography scale (px equivalent values) — from DESIGN_TOKENS.md */
export const PRIMITIVE_FONT_SIZES = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
} as const;

/** Font weights — from DESIGN_TOKENS.md */
export const PRIMITIVE_FONT_WEIGHTS = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/** Font families — from DESIGN_TOKENS.md */
export const PRIMITIVE_FONT_FAMILIES = {
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Fira Mono", monospace',
} as const;

/** 8-point spacing scale (px equivalent) — from DESIGN_TOKENS.md */
export const PRIMITIVE_SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

/** Border radius scale — from DESIGN_TOKENS.md */
export const PRIMITIVE_RADIUS = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
} as const;

/** Blur scale — from DESIGN_TOKENS.md */
export const PRIMITIVE_BLUR = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "32px",
} as const;

// =============================================================================
// SEMANTIC TOKENS
// Meaningful groupings consumed by components.
// =============================================================================

/** Surface tokens — background surfaces */
export const SEMANTIC_COLORS = {
  surface: {
    base: "hsl(40, 38%, 98%)", // Neutral-50 — warm white canvas
    elevated: "hsl(0, 0%, 100%)", // Neutral-0 — pure white cards
    glass: "hsla(0, 0%, 100%, 0.72)", // frosted light
    inverse: "hsl(24, 24%, 8%)", // Neutral-950 — dark chip on light
    overlay: "hsla(24, 24%, 8%, 0.45)", // scrim over 3D
  },
  text: {
    primary: "hsl(24, 24%, 8%)", // Neutral-950 — ink
    secondary: "hsl(25, 11%, 30%)", // Neutral-700
    tertiary: "hsl(30, 8%, 52%)", // Neutral-500
    disabled: "hsl(32, 12%, 70%)", // Neutral-400
    inverse: "hsl(0, 0%, 100%)", // Neutral-0 — text on brand/dark
  },
  border: {
    default: "hsl(36, 20%, 92%)", // Neutral-200
    strong: "hsl(34, 16%, 85%)", // Neutral-300
    subtle: "hsl(40, 24%, 96%)", // Neutral-100
  },
  state: {
    success: "hsl(160, 84%, 39%)", // Emerald-500
    warning: "hsl(41, 82%, 52%)", // Gold-500
    danger: "hsl(0, 78%, 55%)", // FIFA Red-500
    info: "hsl(214, 86%, 55%)", // FIFA Blue-500
    neutral: "hsl(30, 8%, 52%)", // Neutral-500
  },
  navigation: {
    active: "hsl(216, 84%, 48%)", // Blue-600
    hover: "hsl(40, 24%, 96%)", // Neutral-100
    selected: "hsla(214, 86%, 55%, 0.12)", // Blue-500 low alpha
  },
  ai: {
    recommendation: "hsl(214, 86%, 55%)", // Blue-500 — subtle, not chatbot-like
    prediction: "hsl(160, 84%, 39%)", // Emerald-500
    insight: "hsl(30, 8%, 52%)", // Neutral-500
  },
  crowd: {
    low: "hsl(160, 84%, 39%)", // Emerald — safe density
    medium: "hsl(41, 82%, 52%)", // Gold — moderate density
    high: "hsl(36, 80%, 45%)", // Amber-600 — high density
    critical: "hsl(0, 78%, 55%)", // FIFA Red — critical density
  },
  accessibility: {
    route: "hsl(160, 84%, 39%)", // Emerald — accessible routes
    wheelchair: "hsl(214, 86%, 55%)", // Blue-500 — wheelchair specific
    elevator: "hsl(214, 90%, 66%)", // Blue-400 — elevator indicator
    assistance: "hsl(41, 82%, 52%)", // Gold — assistance points
  },
  transportation: {
    parking: "hsl(214, 86%, 55%)", // Blue-500
    metro: "hsl(160, 84%, 39%)", // Emerald-500
    bus: "hsl(41, 82%, 52%)", // Gold-500
    walking: "hsl(30, 8%, 52%)", // Neutral-500
  },
} as const;

/** Z-index layer system — from DESIGN_TOKENS.md */
export const SEMANTIC_Z_INDEX = {
  background: -10,
  surface: 0,
  content: 10,
  navigation: 20,
  overlay: 30,
  modal: 40,
  tooltip: 50,
  notification: 60,
} as const;

/** Elevation (box-shadow) — from DESIGN_TOKENS.md */
export const SEMANTIC_ELEVATION = {
  0: "none",
  1: "0 1px 2px rgba(24, 18, 12, 0.06), 0 1px 3px rgba(24, 18, 12, 0.04)",
  2: "0 2px 6px rgba(24, 18, 12, 0.06), 0 4px 12px rgba(24, 18, 12, 0.05)",
  3: "0 6px 16px rgba(24, 18, 12, 0.08), 0 12px 28px rgba(24, 18, 12, 0.06)",
  4: "0 12px 28px rgba(24, 18, 12, 0.10), 0 24px 48px rgba(24, 18, 12, 0.08)",
  5: "0 24px 56px rgba(24, 18, 12, 0.14), 0 40px 80px rgba(24, 18, 12, 0.10)",
} as const;

/** Opacity scale — from DESIGN_TOKENS.md */
export const SEMANTIC_OPACITY = {
  0: "0",
  5: "0.05",
  10: "0.1",
  20: "0.2",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  80: "0.8",
  90: "0.9",
  100: "1",
} as const;

// =============================================================================
// MOTION TOKENS
// Animation durations and easing functions — from DESIGN_TOKENS.md.
// Motion philosophy: every animation answers "What changed?" (DESIGN_LANGUAGE.md)
// =============================================================================

/** Duration tokens in milliseconds */
export const MOTION_DURATION = {
  instant: 0,
  feedback: 120,
  context: 240,
  transition: 420,
  hero: 900,

  // Legacy compatibility fallbacks
  fast: 120,
  normal: 240,
  moderate: 240,
  slow: 420,
  slower: 420,
  sluggish: 900,
  cinematic: 900,
} as const;

/**
 * Easing tokens — from DESIGN_TOKENS.md.
 * Characteristics: smooth, deliberate, physically believable (DESIGN_LANGUAGE.md).
 */
export const MOTION_EASING = {
  standard: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
  emphasized: [0.2, 0.0, 0.0, 1.0] as [number, number, number, number],
} as const;

// =============================================================================
// 3D TOKENS
// Three.js / R3F specific design constants — from DESIGN_TOKENS.md.
// =============================================================================

/** Camera preset names */
export const THREE_CAMERA_PRESETS = {
  default: "default",
  focus: "focus",
  overview: "overview",
  navigation: "navigation",
  emergency: "emergency",
} as const;

/** Environment / time-of-day presets */
export const THREE_ENVIRONMENT_PRESETS = {
  day: "day",
  night: "night",
  event: "event",
  emergency: "emergency",
} as const;

/** Material type tokens */
export const THREE_MATERIAL_TYPES = {
  matte: "matte",
  glass: "glass",
  metal: "metal",
  transparent: "transparent",
} as const;

/** Lighting role tokens */
export const THREE_LIGHTING_ROLES = {
  ambient: "ambient",
  key: "key",
  fill: "fill",
  rim: "rim",
} as const;

// =============================================================================
// RESPONSIVE TOKENS
// Breakpoints matching Tailwind's default scale — from DESIGN_TOKENS.md.
// =============================================================================

export const BREAKPOINTS = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SurfaceToken = keyof typeof SEMANTIC_COLORS.surface;
export type TextToken = keyof typeof SEMANTIC_COLORS.text;
export type BorderToken = keyof typeof SEMANTIC_COLORS.border;
export type StateToken = keyof typeof SEMANTIC_COLORS.state;
export type CrowdToken = keyof typeof SEMANTIC_COLORS.crowd;
export type MotionDuration = keyof typeof MOTION_DURATION;
export type MotionEasing = keyof typeof MOTION_EASING;
export type CameraPreset = keyof typeof THREE_CAMERA_PRESETS;
export type EnvironmentPreset = keyof typeof THREE_ENVIRONMENT_PRESETS;
export type ZIndexLayer = keyof typeof SEMANTIC_Z_INDEX;
export type ElevationLevel = keyof typeof SEMANTIC_ELEVATION;
