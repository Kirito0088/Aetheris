"use client";

/**
 * Aetheris Error Boundary
 *
 * Catches unexpected React rendering errors and presents a recovery UI.
 *
 * Error handling principles (ENGINEERING_STANDARDS.md):
 * - Errors must be handled explicitly.
 * - Never fail silently.
 * - Never expose internal implementation details to users.
 * - Error messages should suggest a recovery action.
 */

import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Optional error handler (e.g., for logging to a service) */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log error for observability (SYSTEM_ARCHITECTURE.md — Principle 10)
    console.error("[ErrorBoundary] Caught error:", error, info);
    this.props.onError?.(error, info);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100dvh",
            padding: "2rem",
            backgroundColor: "hsl(229, 84%, 5%)",
            color: "hsl(210, 40%, 98%)",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "hsl(210, 40%, 98%)",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "hsl(213, 27%, 84%)",
              maxWidth: "40ch",
              lineHeight: "1.6",
            }}
          >
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "hsl(217, 91%, 60%)",
              color: "hsl(0, 0%, 100%)",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
