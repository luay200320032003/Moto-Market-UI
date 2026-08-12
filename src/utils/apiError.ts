/**
 * Extracts a user-facing message from a failed API call, regardless of which
 * error shape the backend used — the custom `{ code, message }` shape most
 * handlers return, or ASP.NET Core's automatic model-validation shape
 * (`{ title, errors: { Field: ["..."] } }`), which bypasses controller code
 * entirely and has no `message` field at all.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== "object" || err === null) {
    return fallback;
  }

  const data = (err as { response?: { data?: unknown } }).response?.data;

  if (typeof data === "object" && data !== null) {
    const d = data as { message?: unknown; title?: unknown; errors?: Record<string, unknown> };

    if (typeof d.message === "string" && d.message.trim() !== "") {
      return d.message;
    }

    if (d.errors && typeof d.errors === "object") {
      const fieldMessages = Object.values(d.errors)
        .flat()
        .filter((m): m is string => typeof m === "string");
      if (fieldMessages.length > 0) {
        return fieldMessages.join(" ");
      }
    }

    if (typeof d.title === "string" && d.title.trim() !== "") {
      return d.title;
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}
