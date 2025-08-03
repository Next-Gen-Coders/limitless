import axios from "axios";

// Public API client without authentication
const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling (no auth headers needed)
publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors for public endpoints
    if (error.response?.status >= 500) {
      console.error(
        "🔥 Server error:",
        error.response?.data?.message || "Internal server error"
      );
    } else if (error.response?.status === 404) {
      console.warn("🔍 Resource not found:", error.config?.url);
    } else if (error.response?.status >= 400) {
      console.warn(
        "⚠️ Client error:",
        error.response?.data?.message || "Bad request"
      );
    }
    return Promise.reject(error);
  }
);

export default publicApiClient;
