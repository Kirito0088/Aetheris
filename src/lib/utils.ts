/**
 * Aetheris Shared Utilities
 *
 * Utility functions shared across the entire application.
 * All utilities must remain free of business logic (ENGINEERING_STANDARDS.md).
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// =============================================================================
// CLASS NAME UTILITY
// Merges Tailwind CSS classes safely, resolving conflicts.
// This is the standard pattern used throughout the codebase.
// =============================================================================

/**
 * Merge class names using clsx and tailwind-merge.
 * Resolves Tailwind CSS class conflicts correctly.
 *
 * @example
 * cn("px-4 py-2", condition && "bg-blue-500", "text-white")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/** Checks whether a value is defined (not null or undefined). */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Checks whether a string is non-empty after trimming. */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// =============================================================================
// ASSERTION UTILITIES
// =============================================================================

/**
 * Asserts that a value is non-null and non-undefined.
 * Throws a descriptive error in development; narrows type in TypeScript.
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// =============================================================================
// FORMAT UTILITIES
// =============================================================================

/**
 * Formats a percentage value for display.
 * Clamps the value between 0 and 100.
 */
export function formatPercentage(value: number, decimals = 0): string {
  const clamped = Math.max(0, Math.min(100, value));
  return `${clamped.toFixed(decimals)}%`;
}

/**
 * Truncates a string to a maximum length with an ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
