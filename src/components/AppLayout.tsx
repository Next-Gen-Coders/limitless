import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, LogOut, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ui/theme-toggle";
import { useResponsive } from "../hooks/useResponsive";
import { usePrivy } from "@privy-io/react-auth";
import {
  logPrivyUserData,
  logPrivyLogin,
  logPrivyLogout,
} from "../utils/privyLogger";
import { useUserSync } from "../hooks/services";
import { initializePrivyAuth } from "../lib/auth/privyAuth";
import { useUserStore } from "../stores/userStore";

interface AppLayoutProps {
  children: React.ReactNode;
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onChatSelect,
  onNewChat,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const { isMobile } = useResponsive();
  const { authenticated, user, login, logout, ready, getAccessToken } =
    usePrivy();
  const userSyncMutation = useUserSync();
  const clearUser = useUserStore((state) => state.clearUser);

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Close mobile sidebar when screen becomes larger
  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  // Log all Privy user data when authentication state changes
  useEffect(() => {
    if (ready) {
      logPrivyUserData(user, authenticated, ready);
    }
  }, [authenticated, user, ready]);

  // Initialize Privy auth service for axios interceptor
  useEffect(() => {
    if (ready && authenticated && getAccessToken) {
      initializePrivyAuth(getAccessToken);
    }
  }, [ready, authenticated, getAccessToken]);

  // Sync user to backend when authenticated (only once per user)
  useEffect(() => {
    if (authenticated && user && !hasSynced && !userSyncMutation.isPending) {
      userSyncMutation.mutate(user, {
        onSuccess: () => {
          setHasSynced(true);
        },
        onError: () => {
          // Still mark as synced to prevent retry loops, but user sync failed
          setHasSynced(true);
        },
      });
    }
  }, [authenticated, user, hasSynced, userSyncMutation]);

  // Reset sync state when user changes or logs out
  useEffect(() => {
    if (!authenticated) {
      setHasSynced(false);
    }
  }, [authenticated, user?.id]);

  // Track login/logout events specifically
  const [previousAuthState, setPreviousAuthState] = useState(false);

  useEffect(() => {
    if (ready && authenticated !== previousAuthState) {
      if (authenticated && user) {
        logPrivyLogin(user);
      } else if (!authenticated && previousAuthState) {
        logPrivyLogout();
        clearUser(); // Clear Zustand store when user logs out
      }
      setPreviousAuthState(authenticated);
    }
  }, [authenticated, user, ready, previousAuthState, clearUser]);

  // Function to format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get display address (wallet or email)
  const getDisplayInfo = () => {
    if (user?.wallet?.address) {
      return {
        type: "wallet",
        value: formatAddress(user.wallet.address),
        fullValue: user.wallet.address,
      };
    } else if (user?.email?.address) {
      return {
        type: "email",
        value:
          user.email.address.length > 20
            ? `${user.email.address.slice(0, 17)}...`
            : user.email.address,
        fullValue: user.email.address,
      };
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobile={false}
          isOpen={false}
          onClose={() => {}}
          onChatSelect={onChatSelect}
          onNewChat={onNewChat}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          isCollapsed={false}
          onToggle={() => {}}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onChatSelect={onChatSelect}
          onNewChat={onNewChat}
        />
      )}

      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden text-foreground hover:bg-accent"
              >
                <Menu size={20} />
              </Button>
            )}

            <h1 className="text-xl font-semibold text-foreground font-family-zilla">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Authentication Section */}
            {authenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-accent/50 border">
                  <Wallet size={16} className="text-muted-foreground" />
                  <span
                    className="text-sm font-medium"
                    title={getDisplayInfo()?.fullValue}
                  >
                    {getDisplayInfo()?.value}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                  title="Logout"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={login}
                size="sm"
                disabled={userSyncMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {userSyncMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Syncing...
                  </>
                ) : (
                  "Login with Privy"
                )}
              </Button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
