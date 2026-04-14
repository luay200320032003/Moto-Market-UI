const TOKEN_STORAGE_KEY = "token";

export interface AuthUser {
  email?: string;
  full_name?: string;
  role?: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return window.atob(padded);
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const decoded = decodeBase64Url(parts[1]);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string | null): AuthUser | null {
  if (!token) {
    return null;
  }

  const payload = parseJwtPayload(token);
  if (!payload) {
    return null;
  }

  const email =
    typeof payload.email === "string"
      ? payload.email
      : typeof payload.unique_name === "string"
        ? payload.unique_name
        : undefined;

  const fullName =
    typeof payload.name === "string"
      ? payload.name
      : typeof payload.given_name === "string"
        ? payload.given_name
        : undefined;

  const role =
    typeof payload.role === "string"
      ? payload.role
      : typeof payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "string"
        ? (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string)
        : undefined;

  return { email, full_name: fullName, role };
}
