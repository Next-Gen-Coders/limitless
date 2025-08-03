# 🔐 Privy User Data Logging Guide

This guide explains how to view and understand all the Privy user data that gets logged to the console when users authenticate with your application.

## 📍 Where to Find the Logs

1. **Open Developer Console**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
2. **Navigate to Console Tab**: Click on the "Console" tab
3. **Trigger Authentication**: Click "Login with Privy" in the header
4. **Watch the Logs**: Organized console groups will appear with all user data

## 📊 Console Output Structure

### 🔐 Main Authentication State Update
Every time the authentication state changes, you'll see:

```
🔐 Privy Authentication State Update
├── 📊 Authentication Status: true/false
├── 🔄 Privy Ready: true/false
└── ⏰ Timestamp: 2024-01-XX...
```

### 👤 Complete User Object
The raw user object from Privy containing all available data:

```
👤 Complete User Object
└── Raw User Object: { id: "...", createdAt: "...", ... }
```

### 📧 User Basic Information
Essential user identification data:

```
📧 User Basic Info
├── User ID (Privy): "clm1234567890..."
└── Created At: "2024-01-01T12:00:00.000Z"
```

### 📧 Email Information
Email account details (if linked):

```
📧 Email Information
├── Email Object: { address: "user@example.com", ... }
└── Email Address: "user@example.com"
```

### 📱 Phone Information
Phone number details (if linked):

```
📱 Phone Information
├── Phone Object: { number: "+1234567890", ... }
└── Phone Number: "+1234567890"
```

### 👛 Wallet Information
Cryptocurrency wallet details (if connected):

```
👛 Wallet Information
├── Wallet Object: { address: "0x...", chainType: "ethereum", ... }
├── Wallet Address: "0x1234567890abcdef..."
├── Chain Type: "ethereum"
├── Wallet Client Type: "privy"
└── Connector Type: "embedded"
```

### 🔗 Linked Accounts
All connected accounts (email, wallet, social, etc.):

```
🔗 Linked Accounts
├── All Linked Accounts: [...]
├── Account 1: email
│   ├── Account Object: { type: "email", ... }
│   ├── Account Type: "email"
│   └── Email: "user@example.com"
├── Account 2: wallet
│   ├── Account Object: { type: "wallet", ... }
│   ├── Account Type: "wallet"
│   └── Address: "0x1234567890abcdef..."
└── Account 3: google_oauth
    ├── Account Object: { type: "google_oauth", ... }
    └── Account Type: "google_oauth"
```

### 🔐 Smart Wallet Information
Smart wallet details (if enabled):

```
🔐 Smart Wallet Info
├── Smart Wallet Object: { address: "0x...", ... }
├── Smart Wallet Address: "0x9876543210fedcba..."
└── Smart Wallet Type: "safe"
```

### 🔒 MFA Information
Multi-factor authentication methods:

```
🔒 MFA Information
└── MFA Methods: ["sms", "totp"] or "No MFA methods enabled"
```

### 📄 Additional Properties
Any extra properties not covered above:

```
📄 Additional Properties
├── customProperty: "value"
└── anotherProp: { ... }
```

## 🎯 Specific Event Logs

### 🔑 Login Event
When a user successfully logs in:

```
🔑 Privy Login Event
├── ✅ User successfully logged in
├── 👤 User ID: "clm1234567890..."
├── 📧 Email: "user@example.com"
├── 👛 Wallet: "0x1234567890abcdef..."
├── 🔗 Total Linked Accounts: 3
└── ⏰ Login Time: "2024-01-01T12:00:00.000Z"
```

### 🚪 Logout Event
When a user logs out:

```
🚪 Privy Logout Event
├── 👋 User logged out
└── ⏰ Logout Time: "2024-01-01T12:00:00.000Z"
```

## 🔧 Using the Logger Utility

The logging functionality is available through the `privyLogger.ts` utility:

```typescript
import { 
  logPrivyUserData,
  logPrivyLogin,
  logPrivyLogout,
  logWalletConnection,
  logPrivyError 
} from "../utils/privyLogger";

// Log complete user data
logPrivyUserData(user, authenticated, ready);

// Log specific events
logPrivyLogin(user);
logPrivyLogout();
logWalletConnection(user);
logPrivyError(error, "Component name");
```

## 📋 What Data You'll See

Based on how users authenticate, you'll see different data:

### Email Authentication
- User ID, email address, creation date
- Email linked account
- No wallet initially (unless they connect one later)

### Wallet Authentication
- User ID, wallet address, creation date
- Wallet linked account with chain information
- No email initially (unless they link one later)

### Social Authentication (Google, Discord, etc.)
- User ID, social account info, creation date
- Social OAuth linked account
- May include email from social provider

### Combined Authentication
- Multiple linked accounts (email + wallet + social)
- All available data from each authentication method

## 🚨 Important Notes

1. **Privacy**: This logging is for development purposes only. Remove or disable in production.

2. **Sensitive Data**: The logs may contain sensitive information like email addresses and wallet addresses.

3. **Real-time Updates**: The logs update immediately when authentication state changes.

4. **Console Groups**: Logs are organized in collapsible groups for easy navigation.

5. **Error Handling**: Authentication errors are also logged with context.

## 🎨 Console Output Features

- **Emoji Icons**: Easy visual identification of different data types
- **Collapsible Groups**: Organize related information together
- **Timestamps**: Track when events occur
- **Safe Property Access**: Handles missing data gracefully
- **TypeScript Safety**: Proper type checking throughout

---

This comprehensive logging will help you understand exactly what data Privy provides and how it changes throughout the user authentication lifecycle! 🎉