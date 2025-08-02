// Privy authentication service for managing tokens outside React context
let privyGetAccessToken: (() => Promise<string | null>) | null = null;

// Initialize the Privy token getter (called from React components)
export const initializePrivyAuth = (getAccessTokenFn: () => Promise<string | null>) => {
  privyGetAccessToken = getAccessTokenFn;
};

// Get the current Privy access token (used by axios interceptor)
export const getPrivyAccessToken = async (): Promise<string | null> => {
  if (!privyGetAccessToken) {
    console.warn('Privy auth not initialized. Call initializePrivyAuth first.');
    return null;
  }
  
  try {
    return await privyGetAccessToken();
  } catch (error) {
    console.error('Failed to get Privy access token:', error);
    return null;
  }
};

// Check if Privy auth is initialized
export const isPrivyAuthInitialized = (): boolean => {
  return privyGetAccessToken !== null;
};