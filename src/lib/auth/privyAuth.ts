// Privy authentication service for managing tokens outside React context
let privyGetAccessToken: (() => Promise<string | null>) | null = null;

// Initialize the Privy token getter (called from React components)
export const initializePrivyAuth = (getAccessTokenFn: () => Promise<string | null>) => {
  console.log("🔧 DEBUG: Privy auth initialized!");
  privyGetAccessToken = getAccessTokenFn;
};

// Get the current Privy access token (used by axios interceptor)
export const getPrivyAccessToken = async (): Promise<string | null> => {
  console.log("🔍 DEBUG: getPrivyAccessToken called, initialized:", privyGetAccessToken !== null);
  
  if (!privyGetAccessToken) {
    console.error('❌ ERROR: Privy auth not initialized. Call initializePrivyAuth first.');
    return null;
  }
  
  try {
    console.log("🔍 DEBUG: Calling privyGetAccessToken function...");
    const token = await privyGetAccessToken();
    console.log("🔍 DEBUG: Received token:", token ? `${token.substring(0, 20)}...` : "null");
    return token;
  } catch (error) {
    console.error('❌ ERROR: Failed to get Privy access token:', error);
    return null;
  }
};

// Check if Privy auth is initialized
export const isPrivyAuthInitialized = (): boolean => {
  return privyGetAccessToken !== null;
};