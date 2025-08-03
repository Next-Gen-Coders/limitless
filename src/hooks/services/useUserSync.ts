import { useMutation } from "@tanstack/react-query";
import type { User } from "@privy-io/react-auth";
import publicApiClient from "../../lib/config/publicApiClient";
import type { UserSyncRequest, UserSyncResponse } from "../../types/api";
import { API_ENDPOINTS } from "../../types/api";
import { useUserStore } from "../../stores/userStore";

export const useUserSync = () => {
  const { updateUserFromSyncResponse, setLoading, setError } = useUserStore();

  return useMutation<UserSyncResponse, Error, User>({
    mutationFn: async (userData: User) => {
      setLoading(true);
      setError(null);

      const syncData: UserSyncRequest = {
        privyId: userData.id,
        email: userData.email?.address,
        walletAddress: userData.wallet?.address,
        linkedAccounts: userData.linkedAccounts,
        createdAt: userData.createdAt,
      };

      const response = await publicApiClient.post(
        API_ENDPOINTS.USER_SYNC,
        syncData
      );
      return response.data;
    },
    onSuccess: (data, userData) => {
      console.log("User synced to backend:", data);
      console.log("Synced user data:", userData);

      // Update the Zustand store with sync response
      updateUserFromSyncResponse(data);
      setLoading(false);
    },
    onError: (error, userData) => {
      console.error("Error syncing user to backend:", error);
      console.error("Failed to sync user:", userData.id);

      // Update the Zustand store with error
      setError(error.message || "Failed to sync user");
      setLoading(false);
    },
  });
};
