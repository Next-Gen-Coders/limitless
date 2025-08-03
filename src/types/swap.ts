// Swap transaction types based on backend classicSwapTool
export interface SwapQuoteData {
  srcToken: {
    symbol: string;
    address: string;
    decimals: number;
    logoURI?: string;
  };
  dstToken: {
    symbol: string;
    address: string; 
    decimals: number;
    logoURI?: string;
  };
  srcAmount: string;
  dstAmount: string;
  gas: number;
  gasPrice?: string;
  protocols?: Array<{
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }>;
}

export interface SwapTransactionData {
  to: string;
  data: string;
  value: string;
  gas: number;
  gasPrice: string;
  from: string;
}

export interface ApprovalTransactionData {
  to: string;
  data: string;
  value: string;
  gas?: number;
  gasPrice?: string;
}

export interface SwapRequest {
  operation: 'quote' | 'swap' | 'approval_check' | 'get_spender';
  srcToken: string;
  dstToken: string;
  amount: string;
  chain: string;
  walletAddress?: string;
  slippage?: number;
  protocols?: string;
  receiver?: string;
  fee?: number;
  gasPrice?: string;
}

export interface SwapResponse {
  success: boolean;
  data?: {
    quote?: SwapQuoteData;
    swapTransaction?: SwapTransactionData;
    approvalTransaction?: ApprovalTransactionData;
    needsApproval?: boolean;
    spenderAddress?: string;
  };
  message?: string;
  error?: string;
}

export enum SwapTransactionStatus {
  IDLE = 'idle',
  APPROVING = 'approving',
  APPROVED = 'approved',
  SWAPPING = 'swapping',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum SwapChain {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  BASE = 'base',
  OPTIMISM = 'optimism',
  BSC = 'bsc',
  AVALANCHE = 'avalanche'
}

export const CHAIN_IDS: Record<SwapChain, number> = {
  [SwapChain.ETHEREUM]: 1,
  [SwapChain.POLYGON]: 137,
  [SwapChain.ARBITRUM]: 42161,
  [SwapChain.BASE]: 8453,
  [SwapChain.OPTIMISM]: 10,
  [SwapChain.BSC]: 56,
  [SwapChain.AVALANCHE]: 43114
};

export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';