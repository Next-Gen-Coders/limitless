import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, LogOut, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ui/theme-toggle";
import { useResponsive } from "../hooks/useResponsive";
import { usePrivy } from "@privy-io/react-auth";
import { logPrivyUserData, logPrivyLogin, logPrivyLogout } from "../utils/privyLogger";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isMobile } = useResponsive();
  const { authenticated, user, login, logout, ready } = usePrivy();

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

  // Track login/logout events specifically
  const [previousAuthState, setPreviousAuthState] = useState(false);
  
  useEffect(() => {
    if (ready && authenticated !== previousAuthState) {
      if (authenticated && user) {
        logPrivyLogin(user);
      } else if (!authenticated && previousAuthState) {
        logPrivyLogout();
      }
      setPreviousAuthState(authenticated);
    }
  }, [authenticated, user, ready, previousAuthState]);

  // Function to format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get display address (wallet or email)
  const getDisplayInfo = () => {
    if (user?.wallet?.address) {
      return {
        type: 'wallet',
        value: formatAddress(user.wallet.address),
        fullValue: user.wallet.address
      };
    } else if (user?.email?.address) {
      return {
        type: 'email',
        value: user.email.address.length > 20 
          ? `${user.email.address.slice(0, 17)}...` 
          : user.email.address,
        fullValue: user.email.address
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
                  <span className="text-sm font-medium" title={getDisplayInfo()?.fullValue}>
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login with Privy
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
