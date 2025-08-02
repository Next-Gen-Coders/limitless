import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AppPage from "./components/AppPage";
import { ThemeProvider } from "./contexts/ThemeContext";
// import { usePrivy } from "@privy-io/react-auth";
// import AuthComponent from "./components/auth/AuthComponent";
// import { useState, useEffect } from "react";
// import type { User } from "@privy-io/react-auth";

function App() {

  // interface UserSyncResponse {
  //   success: boolean
  //   user: {
  //     id: string // This is the database UUID we need
  //     privy_id: string
  //     email?: string
  //     wallet_address?: string
  //     linked_accounts?: unknown[]
  //     created_at: string
  //     updated_at: string
  //   }
  //   message: string
  // }

  // function App() {
  //   const { authenticated } = usePrivy();
  //   const [user, setUser] = useState<User | null>(null);
  //   const [dbUserId, setDbUserId] = useState<string | null>(null); // Store database user ID

  //   const handleUserAuthenticated = (authenticatedUser: User, userSyncResponse?: UserSyncResponse) => {
  //     setUser(authenticatedUser);

  //     // Store the database user ID from the sync response
  //     if (userSyncResponse?.user?.id) {
  //       setDbUserId(userSyncResponse.user.id);
  //     }
  //   };

  //   // Reset state when user logs out
  //   useEffect(() => {
  //     if (!authenticated) {
  //       setUser(null);
  //       setDbUserId(null);
  //     }
  //   }, [authenticated]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;





//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-4">Limitless</h1>
//           <p className="text-muted-foreground text-lg">
//             Your gateway to Web3 with Privy embedded wallets and EIP-7702 smart wallet features
//           </p>
//         </div>

//         <div className="max-w-4xl mx-auto space-y-8">
//           <AuthComponent onUserAuthenticated={handleUserAuthenticated} />
//         </div>

//         {/* Development Info */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="mt-12 p-4 border rounded-lg bg-muted/50">
//             <h3 className="font-medium mb-2">Development Info</h3>
//             <div className="text-sm space-y-1">
//               <p><strong>Authenticated:</strong> {authenticated ? 'Yes' : 'No'}</p>
//               <p><strong>Privy User ID:</strong> {user?.id || 'N/A'}</p>
//               <p><strong>Database User ID:</strong> {dbUserId || 'N/A'}</p>
//               <p><strong>Email:</strong> {user?.email?.address || 'N/A'}</p>
//               <p><strong>Wallet:</strong> {user?.wallet?.address || 'N/A'}</p>
//             </div>
//           </div>
//         )}
//       </div >
//     </div >
//   );
// }

// export default App;