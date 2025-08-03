import { useQuery } from "@tanstack/react-query";
import publicApiClient from "../../lib/config/publicApiClient";
import type {
  ApiResponseType,
  SimpleHealthResponse,
  ServiceHealthResponse,
} from "../../types/api";
import { API_ENDPOINTS } from "../../types/api";

export const useGetHealth = () => {
  return useQuery<SimpleHealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await publicApiClient.get(API_ENDPOINTS.HEALTH);
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
  return useQuery<ApiResponseType<ServiceHealthResponse>>({
    queryKey: ["service-health", serviceName],
    queryFn: async () => {
      const response = await publicApiClient.get(
        API_ENDPOINTS.SERVICE_HEALTH(serviceName)
      );
      return response.data;
    },
    refetchInterval: 30000,
    enabled: !!serviceName,
  });
};
