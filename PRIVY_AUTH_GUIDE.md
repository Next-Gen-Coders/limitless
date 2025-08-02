# 🔐 Privy Authentication Integration Guide

This guide explains how Privy authentication has been integrated with axios to automatically include access tokens in all API requests.

## 🛠 How It Works

### 🔄 **Automatic Token Injection**
All axios requests now automatically include the Privy access token via an interceptor. No manual token management required!

### 📁 **File Structure**

```
src/
├── lib/
│   ├── auth/
│   │   └── privyAuth.ts          # Token manager service
│   └── config/
│       └── axiosClient.ts        # Updated with Privy interceptor
└── components/
    └── AuthenticatedApiExample.tsx # Demo page showing usage
```

## 🔧 **Technical Implementation**

### **1. Token Manager Service** (`src/lib/auth/privyAuth.ts`)

```typescript
// Global token manager that bridges Privy and axios
let privyGetAccessToken: (() => Promise<string>) | null = null;

export const initializePrivyAuth = (getAccessTokenFn: () => Promise<string>) => {
  privyGetAccessToken = getAccessTokenFn;
};

export const getPrivyAccessToken = async (): Promise<string | null> => {
  if (!privyGetAccessToken) return null;
  return await privyGetAccessToken(); // Auto-refreshes!
};
```

### **2. Updated Axios Interceptor** (`src/lib/config/axiosClient.ts`)

```typescript
// Automatic token injection for ALL requests
axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = await getPrivyAccessToken(); // Fresh token every time
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get access token:", error);
  }
  return config;
});
```

### **3. Component Integration**

```typescript
import { usePrivy } from "@privy-io/react-auth";
import { initializePrivyAuth } from "../lib/auth/privyAuth";

function MyComponent() {
  const { authenticated, getAccessToken } = usePrivy();

  useEffect(() => {
    if (authenticated && getAccessToken) {
      // Initialize the token manager
      initializePrivyAuth(getAccessToken);
    }
  }, [authenticated, getAccessToken]);

  // Now ALL axios calls include auth automatically!
  // No manual token handling needed
}
```

## 🚀 **Usage Examples**

### **Automatic with Existing Hooks**
```typescript
// Your existing API hooks work automatically!
const { data } = useGetHealth(); // ✅ Token included automatically
const { data } = useGetAllUsers(); // ✅ Token included automatically
```

### **Manual API Calls**
```typescript
import { usePrivy } from "@privy-io/react-auth";

async function makeBackendCall() {
  const { getAccessToken } = usePrivy();
  const token = await getAccessToken(); // Auto-refreshes if needed

  const res = await fetch("/api/protected", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ some: "data" })
  });

  const body = await res.json();
  console.log(body);
}
```

## 🎯 **Key Features**

### ✅ **Automatic Token Management**
- **Auto-injection**: Every axios request includes fresh access token
- **Auto-refresh**: Privy handles token refreshing behind the scenes
- **Zero config**: Works with all existing API hooks immediately

### 🛡️ **Error Handling**
- **Graceful fallback**: Requests continue even if token fetch fails
- **Logging**: Clear error messages for debugging
- **401 handling**: Automatic redirect to login on unauthorized responses

### 🔄 **Real-time Updates**
- **Fresh tokens**: Every request gets the latest token
- **No caching issues**: Tokens are always current
- **Session management**: Automatic handling of expired sessions

## 📱 **Demo Page**

Visit `/auth-test` to see the integration in action:

- **User authentication status**
- **Live API testing with automatic auth**
- **Token management demonstration** 
- **Error handling examples**

## 🔐 **Security Features**

### **Token Security**
- Tokens are never stored in localStorage
- Fresh tokens fetched for each request
- Automatic expiration handling

### **Request Security**
- All API calls include proper Authorization headers
- Tokens are managed securely by Privy
- No manual token exposure

### **Error Security**
- Failed token requests don't break the app
- Graceful degradation for unauthenticated requests
- Automatic logout on persistent auth failures

## 🚦 **Implementation Status**

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Axios Interceptor | Complete | Auto-injects tokens in all requests |
| ✅ Token Manager | Complete | Bridges Privy and axios |
| ✅ Auto-refresh | Complete | Privy handles token renewal |
| ✅ Error Handling | Complete | Graceful fallback mechanisms |
| ✅ Demo Page | Complete | Live testing at `/auth-test` |
| ✅ Existing Hooks | Complete | All API hooks work automatically |

## 🎉 **Result**

**Before**: Manual token management required
```typescript
const token = await getAccessToken();
const response = await axios.get('/api/data', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**After**: Completely automatic
```typescript
// Token automatically included! 🎉
const response = await axios.get('/api/data');
const { data } = useGetHealth(); // Also automatic!
```

---

Your Privy authentication is now fully integrated and working automatically with all API calls! 🚀