/**
 * Aetheris Gemini Client — Server-only
 *
 * Provides a lazy-loaded GoogleGenerativeAI instance for server actions
 * and route handlers. Never import this file from client components.
 *
 * The model defaults to "gemini-2.0-flash" for fast structured output.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

/**
 * Returns the shared Gemini client instance.
 * Throws if GEMINI_API_KEY is not set.
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (_client) return _client;

  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local to enable AI features.",
    );
  }

  _client = new GoogleGenerativeAI(apiKey);
  return _client;
}

/** Default model used across the platform */
export const GEMINI_MODEL = "gemini-2.0-flash";
