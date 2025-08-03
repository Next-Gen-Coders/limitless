import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authenticatedApiClient from "../../lib/config/authenticatedApiClient";
import type {
  SwapQuoteRequest,
  SwapExecuteRequest,
  SwapQuoteResponse,
  SwapExecuteResponse,
  SwapStatusResponse,
  UserSwapsResponse,
  SwapQueryKeys,
} from "../../types/api";
import { API_ENDPOINTS } from "../../types/api";

// Query Keys
export const swapKeys: SwapQueryKeys = {
  all: ["swaps"] as const,
  lists: () => [...swapKeys.all, "list"] as const,
  list: (userId: string) => [...swapKeys.lists(), userId] as const,
  details: () => [...swapKeys.all, "detail"] as const,
  detail: (id: string) => [...swapKeys.details(), id] as const,
  status: (swapId: string) =>
    [...swapKeys.details(), swapId, "status"] as const,
};

// Hook to get swap quote
export const useGetSwapQuote = () => {
  return useMutation<SwapQuoteResponse, Error, SwapQuoteRequest>({
    mutationFn: async (request: SwapQuoteRequest) => {
      const response = await authenticatedApiClient.post(
        API_ENDPOINTS.SWAP_QUOTE,
        request
      );
      return response.data;
    },
  });
};

// Hook to execute swap
export const useExecuteSwap = () => {
  const queryClient = useQueryClient();

  return useMutation<SwapExecuteResponse, Error, SwapExecuteRequest>({
    mutationFn: async (request: SwapExecuteRequest) => {
      const response = await authenticatedApiClient.post(
        API_ENDPOINTS.SWAP_EXECUTE,
        request
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate user swaps to refresh the list
      queryClient.invalidateQueries({ queryKey: swapKeys.all });

      // If we have a user ID from context, invalidate specific user swaps
      // This will be handled by the calling component
    },
  });
};

// Hook to get swap status
export const useGetSwapStatus = (swapId: string, enabled: boolean = true) => {
  return useQuery<SwapStatusResponse>({
    queryKey: swapKeys.status(swapId),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.SWAP_STATUS(swapId)
      );
      return response.data;
    },
    enabled: enabled && !!swapId,
    refetchInterval: (data) => {
      // Auto-refresh every 5 seconds if swap is still processing
      const status = data?.data?.status;
      return status === "pending" || status === "processing" ? 5000 : false;
    },
    staleTime: 0, // Always fetch fresh data for status
  });
};

// Hook to get user's swap history
export const useGetUserSwaps = (userId: string, enabled: boolean = true) => {
  return useQuery<UserSwapsResponse>({
    queryKey: swapKeys.list(userId),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.USER_SWAPS
      );
      return response.data;
    },
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for polling swap status until completion
export const useSwapStatusPolling = (
  swapId: string,
  enabled: boolean = true
) => {
  return useQuery<SwapStatusResponse>({
    queryKey: [...swapKeys.status(swapId), "polling"],
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.SWAP_STATUS(swapId)
      );
      return response.data;
    },
    enabled: enabled && !!swapId,
    refetchInterval: (data) => {
      const status = data?.data?.status;
      // Stop polling when swap is completed or failed
      if (status === "completed" || status === "failed") {
        return false;
      }
      // Poll every 5 seconds for pending/processing
      return 5000;
    },
    refetchIntervalInBackground: true, // Keep polling even when window is not focused
    staleTime: 0,
  });
};
