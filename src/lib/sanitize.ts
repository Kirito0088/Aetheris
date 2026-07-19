/** Strip characters that could be used for prompt injection. */
export function sanitizeInput(input: string, maxLength = 500): string {
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // control chars
    .replace(/```/g, "") // code fences
    .slice(0, maxLength)
    .trim();
}
