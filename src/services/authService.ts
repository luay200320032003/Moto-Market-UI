import API from "../api";
import { clearStoredToken, parseJwtPayload, storeToken, storeUser } from "../utils/auth";
import type { AuthUser } from "../utils/auth";

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
  // Merge profile from response body + JWT claims so trial fields are always stored
  try {
    const maybeUser = (data as any)?.user ?? (data as any)?.data?.user ?? (data as any)?.profile ?? (data as any)?.data?.profile ?? null;
    const u: Record<string, any> = maybeUser ?? {};
    const jwt: Record<string, unknown> = parseJwtPayload(token) ?? {};

    const rawSub = jwt.sub ?? jwt.nameid ?? u.id ?? u.userId ?? u.user_id;
    const id = typeof rawSub === "string" && /^\d+$/.test(rawSub)
      ? parseInt(rawSub, 10)
      : typeof rawSub === "number" ? rawSub : undefined;

    const profile: AuthUser = {
      id,
      email:    u.email ?? u.emailAddress ?? (jwt.email as string) ?? (jwt.unique_name as string) ?? undefined,
      full_name: u.full_name ?? u.name ?? (jwt.name as string) ?? undefined,
      firstName: u.firstName ?? u.first_name ?? u.given_name ?? undefined,
      lastName:  u.lastName  ?? u.last_name  ?? u.family_name ?? undefined,
      avatarUrl: u.avatarUrl ?? u.avatar_url ?? u.picture ?? undefined,
      trialEndsAt:
        u.trialEndsAt ?? u.trial_ends_at ??
        (typeof jwt.trialEndsAt === "string" ? jwt.trialEndsAt : undefined) ??
        (typeof jwt.trial_ends_at === "string" ? jwt.trial_ends_at : undefined),
      hasActiveSubscription:
        u.hasActiveSubscription ?? u.has_active_subscription ??
        (jwt.hasActiveSubscription === true || jwt.hasActiveSubscription === "true"
          ? true
          : jwt.hasActiveSubscription === false || jwt.hasActiveSubscription === "false"
            ? false
            : undefined),
      subscriptionPlan: (() => {
        const raw = u.subscriptionPlan ?? u.subscription_plan ?? u.plan ??
          jwt.subscriptionPlan ?? jwt.subscription_plan ?? jwt.plan;
        const v = typeof raw === "string" ? raw.toLowerCase() : undefined;
        return (v === "user" || v === "dealer") ? v : undefined;
      })(),
    };
    storeUser(profile);
  } catch {
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
