"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Venue Operations Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center gap-4">
      <h2 className="text-2xl font-bold text-red-500">Venue Operations Route Error!</h2>
      <p className="text-gray-500 font-mono text-sm max-w-lg whitespace-pre-wrap">{error.message}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
