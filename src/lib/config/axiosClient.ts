import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth headers etc
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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