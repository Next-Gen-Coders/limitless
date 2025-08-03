import axios from "axios";
import { getPrivyAccessToken } from "../auth/privyAuth";

// Authenticated API client - automatically includes Privy auth headers
const authenticatedApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for Privy auth headers
authenticatedApiClient.interceptors.request.use(async (config) => {
  try {
    // Get fresh Privy access token (auto-refreshes if needed)
    const token = await getPrivyAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Only log in development
      if (import.meta.env.MODE === "development") {
        console.log("🔑 Privy token attached to request");
      }
    }
  } catch (error) {
    console.error("Failed to get access token for request:", error);
    // Continue with request even if token fetch fails
  }
  return config;
});

// Add response interceptor for error handling
authenticatedApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (401, 403 etc)
    if (error.response?.status === 401) {
      // Handle unauthorized - but don't redirect immediately
      console.warn("🔒 Unauthorized request detected");
      // Remove any stored tokens (if any)
      localStorage.removeItem("token");
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        console.warn("Redirecting to login page");
        window.location.href = "/";
      }
    } else if (error.response?.status === 403) {
      console.warn("🚫 Forbidden: User lacks permissions for this resource");
    } else if (error.response?.status >= 500) {
      console.error(
        "🔥 Server error:",
        error.response?.data?.message || "Internal server error"
      );
    }
    return Promise.reject(error);
  }
);

// Export as default for backward compatibility
export default authenticatedApiClient;

// Also export with explicit name for clarity
export { authenticatedApiClient };
