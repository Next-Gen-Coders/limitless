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
    console.log("🔍 DEBUG: About to get Privy access token for:", config.url);
    
    // Get fresh Privy access token (auto-refreshes if needed)
    const token = await getPrivyAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 SUCCESS: Privy token attached to request for:", config.url);
      console.log("🔑 Token starts with:", token.substring(0, 20) + "...");
    } else {
      console.error("❌ ERROR: No token received from getPrivyAccessToken for:", config.url);
    }
  } catch (error) {
    console.error("❌ FAILED to get access token for request:", config.url, error);
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
      // Handle unauthorized - redirect to login
      console.warn("🔒 Unauthorized request detected, redirecting to login");
      // Remove any stored tokens (if any)
      localStorage.removeItem("token");
      // Redirect to home page where user can login
      window.location.href = "/";
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
