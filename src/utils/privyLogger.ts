/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "@privy-io/react-auth";

/**
 * Comprehensive Privy user data logger
 * Based on Privy documentation and available user object properties
 */
export const logPrivyUserData = (user: User | null, authenticated: boolean, ready: boolean) => {
  console.group('🔐 Privy Authentication State Update');
  console.log('📊 Authentication Status:', authenticated);
  console.log('🔄 Privy Ready:', ready);
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  if (authenticated && user) {
    console.group('👤 Complete User Object');
    console.log('Raw User Object:', user);
    console.groupEnd();
    
    console.group('📧 User Basic Info');
    console.log('User ID (Privy):', user.id);
    console.log('Created At:', user.createdAt);
    console.groupEnd();
    
    console.group('📧 Email Information');
    if (user.email) {
      console.log('Email Object:', user.email);
      console.log('Email Address:', user.email.address);
    } else {
      console.log('No email linked');
    }
    console.groupEnd();
    
    console.group('📱 Phone Information');
    if (user.phone) {
      console.log('Phone Object:', user.phone);
      console.log('Phone Number:', user.phone.number);
    } else {
      console.log('No phone linked');
    }
    console.groupEnd();
    
    console.group('👛 Wallet Information');
    if (user.wallet) {
      console.log('Wallet Object:', user.wallet);
      console.log('Wallet Address:', user.wallet.address);
      console.log('Chain Type:', user.wallet.chainType);
      console.log('Wallet Client Type:', user.wallet.walletClientType);
      console.log('Connector Type:', user.wallet.connectorType);
    } else {
      console.log('No wallet linked');
    }
    console.groupEnd();
    
    console.group('🔗 Linked Accounts');
    if (user.linkedAccounts && user.linkedAccounts.length > 0) {
      console.log('All Linked Accounts:', user.linkedAccounts);
      user.linkedAccounts.forEach((account, index) => {
        console.group(`Account ${index + 1}: ${account.type}`);
        console.log('Account Object:', account);
        console.log('Account Type:', account.type);
        // Safe property access for different account types
        if ('address' in account) console.log('Address:', account.address);
        if ('email' in account) console.log('Email:', account.email);
        if ('number' in account) console.log('Phone:', account.number);
        console.groupEnd();
      });
    } else {
      console.log('No linked accounts');
    }
    console.groupEnd();
    
    console.group('🔐 Smart Wallet Info');
    if (user.smartWallet) {
      console.log('Smart Wallet Object:', user.smartWallet);
      console.log('Smart Wallet Address:', user.smartWallet.address);
      console.log('Smart Wallet Type:', user.smartWallet.smartWalletType);
    } else {
      console.log('No smart wallet');
    }
    console.groupEnd();
    
    console.group('🔒 MFA Information');
    if (user.mfaMethods && user.mfaMethods.length > 0) {
      console.log('MFA Methods:', user.mfaMethods);
    } else {
      console.log('No MFA methods enabled');
    }
    console.groupEnd();
    
    console.group('📄 Additional Properties');
    const knownProps = ['id', 'createdAt', 'email', 'phone', 'wallet', 'linkedAccounts', 'smartWallet', 'mfaMethods'];
    const additionalProps = Object.keys(user).filter(key => !knownProps.includes(key));
    
    if (additionalProps.length > 0) {
     console.log('Additional Properties:', additionalProps);
    } else {
      console.log('No additional properties');
    }
    console.groupEnd();
    
  } else if (authenticated && !user) {
    console.warn('⚠️ Authenticated but no user object available');
  } else {
    console.log('❌ User not authenticated');
  }
  
  console.groupEnd();
};

/**
 * Log user login event with additional context
 */
export const logPrivyLogin = (user: User) => {
  console.group('🔑 Privy Login Event');
  console.log('✅ User successfully logged in');
  console.log('👤 User ID:', user.id);
  console.log('📧 Email:', user.email?.address || 'No email');
  console.log('👛 Wallet:', user.wallet?.address || 'No wallet');
  console.log('🔗 Total Linked Accounts:', user.linkedAccounts?.length || 0);
  console.log('⏰ Login Time:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Log user logout event
 */
export const logPrivyLogout = () => {
  console.group('🚪 Privy Logout Event');
  console.log('👋 User logged out');
  console.log('⏰ Logout Time:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Log wallet connection events
 */
export const logWalletConnection = (user: User) => {
  console.group('👛 Wallet Connection Event');
  if (user.wallet) {
    console.log('✅ Wallet connected');
    console.log('📍 Address:', user.wallet.address);
    console.log('🔗 Chain Type:', user.wallet.chainType);
    console.log('🔧 Client Type:', user.wallet.walletClientType);
  } else {
    console.log('❌ No wallet connected');
  }
  console.log('⏰ Event Time:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Log authentication errors
 */
export const logPrivyError = (error: any, context?: string) => {
  console.group('❌ Privy Error');
  console.error('Error occurred in:', context || 'Unknown context');
  console.error('Error details:', error);
  console.log('⏰ Error Time:', new Date().toISOString());
  console.groupEnd();
};