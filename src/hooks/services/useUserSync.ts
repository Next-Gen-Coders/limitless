import { useMutation } from "@tanstack/react-query";
import type { User } from '@privy-io/react-auth';
import axiosClient from "../../lib/config/axiosClient";

// Types for user sync
export interface UserSyncData {
  privyId: string;
  email?: string;
  walletAddress?: string;
  linkedAccounts: unknown[];
  createdAt: Date;
}

export interface UserSyncResponse {
  success: boolean;
  user: {
    id: string;
    privy_id: string;
    email?: string;
    wallet_address?: string;
    linked_accounts?: unknown[];
    created_at: string;
    updated_at: string;
  };
  message: string;
}

export const useUserSync = () => {
  return useMutation<UserSyncResponse, Error, User>({
    mutationFn: async (userData: User) => {
      const syncData: UserSyncData = {
        privyId: userData.id,
        email: userData.email?.address,
        walletAddress: userData.wallet?.address,
        linkedAccounts: userData.linkedAccounts,
        createdAt: userData.createdAt,
      };

      const response = await axiosClient.post('/user/sync', syncData);
      return response.data;
    },
    onSuccess: (data, userData) => {
      console.log('User synced to backend:', data);
      console.log('Synced user data:', userData);
    },
    onError: (error, userData) => {
      console.error('Error syncing user to backend:', error);
      console.error('Failed to sync user:', userData.id);
    },
  });
};