import "./App.css";
import { usePrivy } from "@privy-io/react-auth";
import AuthComponent from "./components/auth/AuthComponent";
import Eip7702Component from "./components/wallet/Eip7702Component";
import { useState, useEffect } from "react";
import type { User } from "@privy-io/react-auth";

interface DelegationData {
  id: string
  user_address: string
  nonce: string
  implementation: string
  signature: string
  chain_id: number
  created_at: string
}

interface DelegationTuple {
  address: string
  nonce: string
  implementation: string
  signature: string
  chainId: number
  r: string
  s: string
  yParity: number
}

interface UserSyncResponse {
  success: boolean
  user: {
    id: string // This is the database UUID we need
    privy_id: string
    email?: string
    wallet_address?: string
    linked_accounts?: unknown[]
    created_at: string
    updated_at: string
  }
  delegations: DelegationData[]
  message: string
}

function App() {
  const { authenticated } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [userDelegations, setUserDelegations] = useState<DelegationTuple[]>([]);
  const [dbUserId, setDbUserId] = useState<string | null>(null); // Store database user ID

  const handleUserAuthenticated = (authenticatedUser: User, userSyncResponse?: UserSyncResponse) => {
    setUser(authenticatedUser);

    // Store the database user ID from the sync response
    if (userSyncResponse?.user?.id) {
      setDbUserId(userSyncResponse.user.id);
    }

    // Convert backend delegation format to frontend format
    if (userSyncResponse?.delegations) {
      const convertedDelegations: DelegationTuple[] = userSyncResponse.delegations.map(delegation => ({
        address: delegation.user_address,
        nonce: delegation.nonce,
        implementation: delegation.implementation,
        signature: delegation.signature,
        chainId: delegation.chain_id,
        // Note: Backend should store r, s, yParity separately or we need to parse signature
        r: delegation.signature.slice(0, 66), // First 32 bytes (64 chars + 0x)
        s: '0x' + delegation.signature.slice(66, 130), // Next 32 bytes
        yParity: parseInt(delegation.signature.slice(130), 16), // Last byte
      }));
      setUserDelegations(convertedDelegations);
    }
  };

  const handleDelegationCreated = (delegation: DelegationTuple) => {
    console.log("New delegation created:", delegation);
    // Add new delegation to the list
    setUserDelegations(prev => [...prev, delegation]);
  };

  // Reset state when user logs out
  useEffect(() => {
    if (!authenticated) {
      setUser(null);
      setDbUserId(null);
      setUserDelegations([]);
    }
  }, [authenticated]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Limitless</h1>
          <p className="text-muted-foreground text-lg">
            Your gateway to Web3 with Privy embedded wallets and EIP-7702 smart wallet features
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <AuthComponent onUserAuthenticated={handleUserAuthenticated} />

          {authenticated && (
            <Eip7702Component
              onDelegationCreated={handleDelegationCreated}
              existingDelegations={userDelegations}
              userId={dbUserId || undefined}
            />
          )}
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Development Info</h3>
            <div className="text-sm space-y-1">
              <p><strong>Authenticated:</strong> {authenticated ? 'Yes' : 'No'}</p>
              <p><strong>Privy User ID:</strong> {user?.id || 'N/A'}</p>
              <p><strong>Database User ID:</strong> {dbUserId || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email?.address || 'N/A'}</p>
              <p><strong>Wallet:</strong> {user?.wallet?.address || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
