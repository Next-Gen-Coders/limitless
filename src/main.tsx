import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivyProvider } from '@privy-io/react-auth'

// Configure supported chains for embedded wallets
const supportedChains = [
  {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://ethereum-rpc.publicnode.com'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
  },
  {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://ethereum-sepolia-rpc.publicnode.com'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
  },
  {
    id: 10,
    name: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.optimism.io'] },
    },
    blockExplorers: {
      default: { name: 'Optimistic Etherscan', url: 'https://optimistic.etherscan.io' },
    },
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://arb1.arbitrum.io/rpc'] },
    },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    },
  },
  {
    id: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.base.org'] },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://basescan.org' },
    },
  },
  {
    id: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://polygon-rpc.com'] },
    },
    blockExplorers: {
      default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
    },
  },
]

// EIP-7702 is supported on these chains (as of 2025)
export const EIP_7702_SUPPORTED_CHAINS = [
  1,          // Ethereum Mainnet
  11155111,   // Sepolia Testnet  
  10,         // Optimism
  42161,      // Arbitrum One
  8453,       // Base
  137,        // Polygon
]

createRoot(document.getElementById('root')!).render(
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID || 'your_privy_app_id_here'}
    config={{
      loginMethods: ['email', 'wallet', 'google', 'discord'],
      appearance: {
        theme: 'dark',
        accentColor: '#676FFF',
        logo: '/logo.png',
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
        showWalletUIs: true,
      },
      defaultChain: supportedChains[0], // Set Ethereum as default
      supportedChains,
    }}
  >
    <App />
  </PrivyProvider>
)
