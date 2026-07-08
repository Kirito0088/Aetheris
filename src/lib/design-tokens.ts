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

/** Neutral palette — full grey scale from white to near-black */
export const PRIMITIVE_COLORS = {
  neutral: {
    0: "hsl(0, 0%, 100%)",
    50: "hsl(210, 40%, 98%)",
    100: "hsl(210, 40%, 96%)",
    200: "hsl(214, 32%, 91%)",
    300: "hsl(213, 27%, 84%)",
    400: "hsl(215, 20%, 65%)",
    500: "hsl(215, 16%, 47%)",
    600: "hsl(215, 19%, 35%)",
    700: "hsl(215, 25%, 27%)",
    800: "hsl(217, 33%, 17%)",
    900: "hsl(222, 47%, 11%)",
    950: "hsl(229, 84%, 5%)",
  },
  blue: {
    50: "hsl(214, 100%, 97%)",
    100: "hsl(214, 95%, 93%)",
    200: "hsl(213, 97%, 87%)",
    300: "hsl(212, 96%, 78%)",
    400: "hsl(213, 94%, 68%)",
    500: "hsl(217, 91%, 60%)",
    600: "hsl(221, 83%, 53%)",
    700: "hsl(224, 76%, 48%)",
    800: "hsl(226, 71%, 40%)",
    900: "hsl(224, 64%, 33%)",
  },
  green: {
    50: "hsl(138, 76%, 97%)",
    100: "hsl(141, 84%, 93%)",
    200: "hsl(141, 79%, 85%)",
    300: "hsl(142, 77%, 73%)",
    400: "hsl(142, 69%, 58%)",
    500: "hsl(142, 71%, 45%)",
    600: "hsl(142, 76%, 36%)",
    700: "hsl(142, 72%, 29%)",
    800: "hsl(143, 64%, 24%)",
    900: "hsl(144, 61%, 20%)",
  },
  amber: {
    50: "hsl(48, 100%, 96%)",
    100: "hsl(48, 96%, 89%)",
    200: "hsl(48, 97%, 77%)",
    300: "hsl(46, 97%, 65%)",
    400: "hsl(43, 96%, 56%)",
    500: "hsl(38, 92%, 50%)",
    600: "hsl(32, 95%, 44%)",
    700: "hsl(26, 90%, 37%)",
    800: "hsl(23, 83%, 31%)",
    900: "hsl(22, 78%, 26%)",
  },
  red: {
    50: "hsl(0, 86%, 97%)",
    100: "hsl(0, 93%, 94%)",
    200: "hsl(0, 96%, 89%)",
    300: "hsl(0, 94%, 82%)",
    400: "hsl(0, 91%, 71%)",
    500: "hsl(0, 84%, 60%)",
    600: "hsl(0, 72%, 51%)",
    700: "hsl(0, 74%, 42%)",
    800: "hsl(0, 70%, 35%)",
    900: "hsl(0, 63%, 31%)",
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
    base: "hsl(229, 84%, 5%)", // Neutral-950
    elevated: "hsl(222, 47%, 11%)", // Neutral-900
    glass: "hsla(222, 47%, 11%, 0.6)", // Neutral-900 + alpha
    inverse: "hsl(0, 0%, 100%)", // Neutral-0
    overlay: "hsla(229, 84%, 5%, 0.8)", // Base + alpha
  },
  text: {
    primary: "hsl(210, 40%, 98%)", // Neutral-50
    secondary: "hsl(213, 27%, 84%)", // Neutral-300
    tertiary: "hsl(215, 20%, 65%)", // Neutral-400
    disabled: "hsl(215, 16%, 47%)", // Neutral-500
    inverse: "hsl(229, 84%, 5%)", // Neutral-950
  },
  border: {
    default: "hsl(215, 25%, 27%)", // Neutral-700
    strong: "hsl(215, 19%, 35%)", // Neutral-600
    subtle: "hsl(217, 33%, 17%)", // Neutral-800
  },
  state: {
    success: "hsl(142, 71%, 45%)", // Green-500
    warning: "hsl(38, 92%, 50%)", // Amber-500
    danger: "hsl(0, 84%, 60%)", // Red-500
    info: "hsl(217, 91%, 60%)", // Blue-500
    neutral: "hsl(215, 16%, 47%)", // Neutral-500
  },
  navigation: {
    active: "hsl(217, 91%, 60%)", // Blue-500
    hover: "hsl(217, 33%, 17%)", // Neutral-800
    selected: "hsla(217, 91%, 60%, 0.15)", // Blue-500 with low alpha
  },
  ai: {
    recommendation: "hsl(217, 91%, 60%)", // Blue-500 — subtle, not chatbot-like
    prediction: "hsl(142, 71%, 45%)", // Green-500
    insight: "hsl(215, 20%, 65%)", // Neutral-400
  },
  crowd: {
    low: "hsl(142, 71%, 45%)", // Green-500 — safe density
    medium: "hsl(38, 92%, 50%)", // Amber-500 — moderate density
    high: "hsl(32, 95%, 44%)", // Amber-600 — high density
    critical: "hsl(0, 84%, 60%)", // Red-500 — critical density
  },
  accessibility: {
    route: "hsl(142, 71%, 45%)", // Green-500 — accessible routes
    wheelchair: "hsl(213, 94%, 68%)", // Blue-300 — wheelchair specific
    elevator: "hsl(214, 95%, 93%)", // Blue-100 — elevator indicator
    assistance: "hsl(38, 92%, 50%)", // Amber-500 — assistance points
  },
  transportation: {
    parking: "hsl(217, 91%, 60%)", // Blue-500
    metro: "hsl(142, 71%, 45%)", // Green-500
    bus: "hsl(38, 92%, 50%)", // Amber-500
    walking: "hsl(215, 20%, 65%)", // Neutral-400
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
  1: "0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)",
  2: "0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.4)",
  3: "0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.4)",
  4: "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.5)",
  5: "0 25px 50px -12px rgba(0,0,0,0.6)",
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
  instant: 100,
  fast: 150,
  normal: 200,
  moderate: 250,
  slow: 300,
  slower: 400,
  sluggish: 600,
  cinematic: 800,
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
