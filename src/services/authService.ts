import API from "../api";
import { clearStoredToken, storeToken, storeUser } from "../utils/auth";

interface LoginPayload {
  userNameOrEmail: string;
  password: string;
}

type AuthResponse = Record<string, unknown>;

const loginEndpoint = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT ?? "/api/auth/login";
const individualSsoEndpoint =
  import.meta.env.VITE_AUTH_INDIVIDUAL_SSO_ENDPOINT ?? "/api/auth/sso/individual";

function getNestedValue<T>(source: Record<string, unknown>, key: string): T | undefined {
  const value = source[key];
  return value as T | undefined;
}

function extractToken(response: AuthResponse): string | null {
  const directTokenKeys = ["token", "accessToken", "access_token", "jwt", "jwtToken"];

  for (const key of directTokenKeys) {
    const token = getNestedValue<string>(response, key);
    if (typeof token === "string" && token.length > 0) {
      return token;
    }
  }

  const nestedData = getNestedValue<Record<string, unknown>>(response, "data");
  if (nestedData) {
    for (const key of directTokenKeys) {
      const token = getNestedValue<string>(nestedData, key);
      if (typeof token === "string" && token.length > 0) {
        return token;
      }
    }
  }

  return null;
}

export async function login(payload: LoginPayload): Promise<string> {
  const { data } = await API.post<AuthResponse>(loginEndpoint, payload, { timeout: 60000 });
  const token = extractToken(data);

  if (!token) {
    throw new Error("Login succeeded but no token was returned by the backend.");
  }

  storeToken(token);
  // Try to capture profile returned by the backend and cache it
  try {
    const maybeUser = (data && (data as any).user) || (data && (data as any).data && (data as any).data.user) || (data && (data as any).profile) || (data && (data as any).data && (data as any).data.profile) || null;
    if (maybeUser) {
      const u = maybeUser as Record<string, any>;
      const profile = {
        email: u.email ?? u.emailAddress ?? undefined,
        full_name: u.full_name ?? u.name ?? undefined,
        firstName: u.firstName ?? u.first_name ?? u.given_name ?? undefined,
        lastName: u.lastName ?? u.last_name ?? u.family_name ?? undefined,
        avatarUrl: u.avatarUrl ?? u.avatar_url ?? u.picture ?? undefined,
      };
      try { storeUser(profile as any); } catch {}
    }
  } catch (err) {
    // ignore
  }

  return token;
}

export function getIndividualSsoLoginUrl(returnUrl: string): string {
  const resolvedBase = API.defaults.baseURL ?? window.location.origin;
  const ssoUrl = new URL(individualSsoEndpoint, resolvedBase);

  ssoUrl.searchParams.set("returnUrl", returnUrl);

  return ssoUrl.toString();
}

export function logout(): void {
  clearStoredToken();
}
