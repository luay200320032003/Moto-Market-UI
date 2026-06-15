const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user_profile";

export interface AuthUser {
  email?: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
  trialEndsAt?: string;
  hasActiveSubscription?: boolean;
}

export function isTrialActive(user: AuthUser | null): boolean {
  if (!user?.trialEndsAt) return false;
  return new Date(user.trialEndsAt) > new Date();
}

/** Returns days remaining in trial (0 if expired or no trial data). */
export function trialDaysLeft(user: AuthUser | null): number {
  if (!user?.trialEndsAt) return 0;
  const diff = new Date(user.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

/**
 * Returns true if the user is allowed to create listings.
 * Falls back to true when trialEndsAt is absent (backend not yet updated).
 */
export function canCreateListing(user: AuthUser | null): boolean {
  if (!user) return false;
  if (user.hasActiveSubscription) return true;
  if (user.trialEndsAt) return isTrialActive(user);
  return true; // no trial data — don't block until backend sends it
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

export function storeUser(user: AuthUser | null): void {
  if (!user) {
    try { localStorage.removeItem(USER_STORAGE_KEY); } catch {}
    return;
  }
  try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); } catch {}
}

export function getStoredUser(): AuthUser | null {
  try {
    const v = localStorage.getItem(USER_STORAGE_KEY);
    if (!v) return null;
    return JSON.parse(v) as AuthUser;
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  try { localStorage.removeItem(USER_STORAGE_KEY); } catch {}
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

  const trialEndsAt =
    typeof payload.trialEndsAt === "string" ? payload.trialEndsAt :
    typeof payload.trial_ends_at === "string" ? payload.trial_ends_at : undefined;

  const hasActiveSubscription =
    payload.hasActiveSubscription === true || payload.hasActiveSubscription === "true" ||
    payload.has_active_subscription === true || payload.has_active_subscription === "true"
      ? true
      : (payload.hasActiveSubscription === false || payload.hasActiveSubscription === "false" ||
         payload.has_active_subscription === false || payload.has_active_subscription === "false"
           ? false : undefined);

  return { email, full_name: fullName, role, trialEndsAt, hasActiveSubscription };
}
