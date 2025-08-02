import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { initializePrivyAuth } from "../lib/auth/privyAuth";
import { useGetHealth } from "../hooks/services/useHealth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge-export";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

const AuthenticatedApiExample = () => {
  const { authenticated, getAccessToken, login, logout, user } = usePrivy();
  const { data: healthData, isLoading, error, refetch } = useGetHealth();

  // Initialize Privy auth for axios interceptor
  useEffect(() => {
    if (authenticated && getAccessToken) {
      // Wrap getAccessToken to handle null returns
      const wrappedGetAccessToken = async () => {
        const token = await getAccessToken();
        return token; // This can be string | null
      };
      initializePrivyAuth(wrappedGetAccessToken);
    }
  }, [authenticated, getAccessToken]);

  // Example function showing how to make authenticated API calls
  const makeBackendCall = async () => {
    try {
      const token = await getAccessToken();
      console.log("🔑 Access token obtained:", token ? "✅ Success" : "❌ Failed");

      const res = await fetch("/api/protected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ some: "data" })
      });

      const body = await res.json();
      console.log("📡 Backend response:", body);
    } catch (error) {
      console.error("❌ Backend call failed:", error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">
            Please login to test authenticated API calls
          </p>
          <Button onClick={login} className="w-full">
            Login with Privy
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Authenticated API Testing</h1>
            <p className="text-muted-foreground mt-2">
              Test Privy authentication with backend API calls
            </p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* User Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium">{user?.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email?.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet</p>
              <p className="font-medium font-mono text-sm">
                {user?.wallet?.address ? 
                  `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                  'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Linked Accounts</p>
              <p className="font-medium">{user?.linkedAccounts?.length || 0}</p>
            </div>
          </div>
        </Card>

        {/* API Testing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health API Test */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Health API (Axios with Interceptor)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : error ? (
                  <Badge variant="destructive">Error</Badge>
                ) : healthData?.status ? (
                  <Badge className="bg-green-500 text-white">
                    {healthData.status}
                  </Badge>
                ) : (
                  <Badge variant="outline">Unknown</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auto-auth:</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>

              {healthData && (
                <div className="bg-muted p-3 rounded text-sm">
                  <pre>{JSON.stringify(healthData, null, 2)}</pre>
                </div>
              )}

              <Button onClick={() => refetch()} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Health API
              </Button>
            </div>
          </Card>

          {/* Manual API Test */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Manual API Call (Fetch)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Method:</span>
                <Badge variant="outline">Manual Token</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auto-refresh:</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>

              <div className="bg-muted p-3 rounded text-sm">
                <p className="font-medium mb-2">Example Usage:</p>
                <pre className="text-xs">{`const token = await getAccessToken();
fetch("/api/protected", {
  headers: {
    "Authorization": \`Bearer \${token}\`
  }
});`}</pre>
              </div>

              <Button onClick={makeBackendCall} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Manual API Call
              </Button>
            </div>
          </Card>
        </div>

        {/* Token Info */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Authentication Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Privy Auth:</span>
              {authenticated ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Disconnected</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Axios Interceptor:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto-refresh:</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Enabled</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>1. Automatic Token Injection:</strong> All axios requests automatically include the Privy access token via interceptor
            </p>
            <p>
              <strong>2. Auto-refresh:</strong> Tokens are automatically refreshed by Privy when needed
            </p>
            <p>
              <strong>3. Error Handling:</strong> Failed token requests fall back gracefully
            </p>
            <p>
              <strong>4. No Manual Work:</strong> Just use your existing axios-based API hooks - authentication is handled automatically
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthenticatedApiExample;