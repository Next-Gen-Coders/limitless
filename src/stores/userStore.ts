import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSyncResponse } from "../types/api";

interface User {
  id: string;
  privyId: string;
  email?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserFromSyncResponse: (syncResponse: UserSyncResponse) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user: User) => {
        set({ user, error: null });
      },

      clearUser: () => {
        set({ user: null, error: null });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUserFromSyncResponse: (syncResponse: UserSyncResponse) => {
        if (syncResponse.success && syncResponse.user) {
          const user: User = {
            id: syncResponse.user.id,
            privyId: syncResponse.user.privy_id,
            email: syncResponse.user.email,
            walletAddress: syncResponse.user.wallet_address,
            createdAt: syncResponse.user.created_at,
            updatedAt: syncResponse.user.updated_at,
          };
          set({ user, error: null });
        } else {
          set({ error: syncResponse.message || "Failed to sync user" });
        }
      },
    }),
    {
      name: "user-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
      }), // only persist user data, not loading/error states
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useUserId = () => useUserStore((state) => state.user?.id);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);
