import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, ready } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if Privy is ready and user is not authenticated
    if (ready && !authenticated) {
      navigate("/", { replace: true });
    }
  }, [authenticated, ready, navigate]);

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
