import axios from "axios";
import { getStoredToken } from "./utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 20000,
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

export default API;
