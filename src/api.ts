import axios from "axios";
import { getStoredToken, clearStoredToken, clearStoredUser } from "./utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A 401 means the stored token is missing/expired/invalid — clear the stale
// session and send the user back to login instead of letting every page
// show its own raw "failed to load" error for what's really a login issue.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && window.location.pathname !== "/login") {
      clearStoredToken();
      clearStoredUser();
      const returnTo = window.location.pathname + window.location.search;
      window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
    }
    return Promise.reject(error);
  }
);

export default API;
