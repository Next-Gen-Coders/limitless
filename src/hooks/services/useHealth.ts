import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/config/axiosClient";
import type { ApiResponseType } from "../../types/api";

// Health check response type
export interface HealthService {
  status: "limitless" | "down";
  responseTime?: number;
}

// Simple health response (what your API actually returns)
export interface SimpleHealthResponse {
  status: string;
}

// Full health response (for future expansion)
export interface HealthCheckResponse {
  status: "limitless" | "healthy" | "unhealthy" | "degraded";
  timestamp?: string;
  services?: Record<string, HealthService>;
  uptime?: number;
  version?: string;
  environment?: string;
}

export const useGetHealth = () => {
  return useQuery<SimpleHealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await apiClient.get("/health");
      // Handle both wrapped and unwrapped responses
      if (response.data.data) {
        return response.data.data; // If wrapped in ApiResponseType
      }
      return response.data; // If direct response
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 2,
  });
};

// Hook for checking individual service health
export const useGetServiceHealth = (serviceName: string) => {
  return useQuery<ApiResponseType<{ status: string; responseTime?: number }>>({
    queryKey: ["service-health", serviceName],
    queryFn: async () => {
      const response = await apiClient.get(`/health/${serviceName}`);
      return response.data;
    },
    refetchInterval: 30000,
    enabled: !!serviceName,
  });
};