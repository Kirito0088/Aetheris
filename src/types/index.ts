/**
 * Aetheris Global Type Definitions
 *
 * Shared TypeScript types used across the entire application.
 * Feature-specific types belong inside their respective feature directories.
 *
 * Naming convention (ENGINEERING_STANDARDS.md): PascalCase for types/interfaces.
 */

// =============================================================================
// STAKEHOLDER TYPES
// Defined by PRD v1.0 — Part III Stakeholders.
// Every stakeholder shares the same platform but receives role-specific context.
// =============================================================================

/**
 * Stakeholder roles within the Aetheris platform.
 * Roles determine available features, information density, and permissions.
 */
export type StakeholderRole =
  | "fan"
  | "volunteer"
  | "security"
  | "medical"
  | "operations"
  | "administrator";

// =============================================================================
// OPERATIONAL STATE TYPES
// =============================================================================

/**
 * Crowd density classification for a venue zone.
 * Maps to SEMANTIC_COLORS.crowd tokens in design-tokens.ts.
 */
export type CrowdDensity = "low" | "medium" | "high" | "critical";

/**
 * Operational status of a venue element (gate, entrance, etc.)
 */
export type OperationalStatus = "open" | "closed" | "restricted" | "emergency";

/**
 * Transportation mode types.
 * Maps to SEMANTIC_COLORS.transportation tokens.
 */
export type TransportMode = "parking" | "metro" | "bus" | "walking";

// =============================================================================
// SPATIAL TYPES
// Every recommendation must be grounded in spatial context (SYSTEM_ARCHITECTURE.md).
// =============================================================================

/**
 * A geographic coordinate within the venue.
 */
export interface VenueCoordinate {
  /** X position in the venue's local coordinate system */
  x: number;
  /** Y position in the venue's local coordinate system */
  y: number;
  /** Z position (elevation) — optional for 2D contexts */
  z?: number;
}

/**
 * A named zone within the venue.
 */
export interface VenueZone {
  id: string;
  name: string;
  type: "gate" | "seating" | "parking" | "facility" | "restricted";
  status: OperationalStatus;
  coordinates: VenueCoordinate;
}

// =============================================================================
// APPLICATION STATE TYPES
// =============================================================================

/**
 * The current operational context assembled before AI reasoning.
 * Context is a first-class architectural concern (SYSTEM_ARCHITECTURE.md).
 */
export interface OperationalContext {
  /** The active stakeholder role */
  role: StakeholderRole;
  /** Current venue zone (if known) */
  currentZone?: VenueZone;
  /** Language preference (BCP-47 tag) */
  language: string;
  /** Whether accessibility mode is active */
  accessibilityMode: boolean;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

/** Standard children prop */
export interface WithChildren {
  children: React.ReactNode;
}

/** Standard className prop for styled components */
export interface WithClassName {
  className?: string;
}

/** Combined base props for styled components */
export type BaseComponentProps = WithChildren & WithClassName;

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Standard API response envelope.
 * All Route Handlers should return this shape.
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
