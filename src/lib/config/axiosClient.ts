import axios from "axios";
import { getPrivyAccessToken } from "../auth/privyAuth";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for Privy auth headers
axiosClient.interceptors.request.use(async (config) => {
  try {
    // Get fresh Privy access token (auto-refreshes if needed)
    const token = await getPrivyAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get access token for request:", error);
    // Continue with request even if token fetch fails
  }
  return config;
});

// Add response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (401, 403 etc)
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("token");
      // For Vite + React Router, use window.location or navigate
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;