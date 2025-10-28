import axios from 'axios';

const API = axios.create({
 baseURL: import.meta.env.VITE_API_BASE,
  timeout: 20000, // Set a timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
    console.log("🔐 Using token:", token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
