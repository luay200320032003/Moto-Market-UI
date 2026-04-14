import API from "../api";
import { clearStoredToken, storeToken } from "../utils/auth";

interface LoginPayload {
  email: string;
  password: string;
}

type AuthResponse = Record<string, unknown>;

const loginEndpoint = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT ?? "/api/auth/login";

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
  const { data } = await API.post<AuthResponse>(loginEndpoint, payload);
  const token = extractToken(data);

  if (!token) {
    throw new Error("Login succeeded but no token was returned by the backend.");
  }

  storeToken(token);
  return token;
}

export function logout(): void {
  clearStoredToken();
}
