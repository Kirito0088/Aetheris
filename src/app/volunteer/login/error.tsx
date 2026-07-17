"use client";

import { useEffect } from "react";

export default function VolunteerLoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Volunteer Login Route Error Boundary caught error:", error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "16px",
        gap: "16px",
        backgroundColor: "var(--surface-base)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 12px",
          backgroundColor: "hsla(0, 84%, 60%, 0.1)",
          borderRadius: "9999px",
          border: "1px solid var(--state-danger)",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "var(--state-danger)",
          }}
        />
        <span
          style={{
            fontSize: "var(--font-size-xs)",
            fontWeight: "500",
            color: "var(--state-danger)",
            textTransform: "uppercase",
          }}
        >
          Authentication Error
        </span>
      </div>

      <h1
        style={{
          fontSize: "var(--font-size-xl)",
          fontWeight: "600",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Unable to load Sign In
      </h1>

      <p
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--text-secondary)",
          maxWidth: "340px",
          margin: 0,
        }}
      >
        {error.message || "An error occurred while preparing the login environment."}
      </p>

      <button
        onClick={reset}
        style={{
          padding: "10px 20px",
          backgroundColor: "var(--brand-emerald, #10B981)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--font-size-sm)",
          fontWeight: "600",
          cursor: "pointer",
          transition: "opacity 120ms ease",
        }}
        onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")}
        onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
      >
        Try again
      </button>
    </div>
  );
}
