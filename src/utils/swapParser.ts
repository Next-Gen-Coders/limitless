import type { SwapQuoteData, SwapTransactionData, ApprovalTransactionData } from '../types/swap';

// Pattern to match swap transaction data in AI messages
const SWAP_QUOTE_PATTERN = /🔄.*?Swap.*?on\s+(\w+)/i;
const TOKEN_PATTERN = /(\d+(?:\.\d+)?)\s+(\w+)/g;
const ADDRESS_PATTERN = /0x[a-fA-F0-9]{40}/g;
const GAS_PATTERN = /Estimated\s+[Gg]as.*?(\d+(?:,\d{3})*)/;
const TRANSACTION_DATA_PATTERN = /To:\s*(0x[a-fA-F0-9]{40}).*?Data:\s*(0x[a-fA-F0-9]+).*?Value:\s*(\d+)/s;

export interface ParsedSwapData {
  quote?: SwapQuoteData;
  approvalTransaction?: ApprovalTransactionData;
  swapTransaction?: SwapTransactionData;
  spenderAddress?: string;
  needsApproval?: boolean;
  chainName?: string;
}

/**
 * Parse AI message content to extract swap transaction data
 */
export function parseSwapData(content: string): ParsedSwapData | null {
  try {
    // Check if this is a swap-related message
    if (!content.match(/swap|exchange|trade/i) || !content.match(/approve|approval/i)) {
      return null;
    }

    const result: ParsedSwapData = {};

    // Extract chain name
    const chainMatch = content.match(SWAP_QUOTE_PATTERN);
    if (chainMatch) {
      result.chainName = chainMatch[1];
    }

    // Check if approval is needed
    result.needsApproval = content.includes('approval') && content.includes('router');

    // Extract spender address (1inch router)
    const spenderMatch = content.match(/spender.*?(0x[a-fA-F0-9]{40})/i);
    if (spenderMatch) {
      result.spenderAddress = spenderMatch[1];
    }

    // Extract token information and amounts
    const tokens = Array.from(content.matchAll(TOKEN_PATTERN));
    const addresses = Array.from(content.matchAll(ADDRESS_PATTERN));

    if (tokens.length >= 2 && addresses.length >= 2) {
      // Extract source and destination tokens
      const srcTokenInfo = tokens[0];
      const dstTokenInfo = tokens[1];

      // Parse amounts (convert to wei/smallest units for demo)
      const srcAmount = parseFloat(srcTokenInfo[1]);
      const dstAmount = parseFloat(dstTokenInfo[1]);

      result.quote = {
        srcToken: {
          symbol: srcTokenInfo[2],
          address: addresses[0][0],
          decimals: getTokenDecimals(srcTokenInfo[2]), // Default decimals based on token
          logoURI: getTokenLogo(srcTokenInfo[2])
        },
        dstToken: {
          symbol: dstTokenInfo[2],
          address: addresses[1][0],
          decimals: getTokenDecimals(dstTokenInfo[2]),
          logoURI: getTokenLogo(dstTokenInfo[2])
        },
        srcAmount: (srcAmount * Math.pow(10, getTokenDecimals(srcTokenInfo[2]))).toString(),
        dstAmount: (dstAmount * Math.pow(10, getTokenDecimals(dstTokenInfo[2]))).toString(),
        gas: extractGasEstimate(content),
        protocols: extractProtocols(content)
      };
    }

    // Extract approval transaction data
    if (result.needsApproval && content.includes('Approval Transaction Details:')) {
      const approvalSection = content.split('Approval Transaction Details:')[1];
      if (approvalSection) {
        const approvalMatch = approvalSection.match(TRANSACTION_DATA_PATTERN);
        if (approvalMatch) {
          result.approvalTransaction = {
            to: approvalMatch[1],
            data: approvalMatch[2],
            value: approvalMatch[3] || '0'
          };
        }
      }
    }

    // Extract swap transaction data (if provided)
    if (content.includes('swap transaction') && content.includes('calldata')) {
      const swapMatch = content.match(TRANSACTION_DATA_PATTERN);
      if (swapMatch) {
        result.swapTransaction = {
          to: swapMatch[1],
          data: swapMatch[2],
          value: swapMatch[3] || '0',
          gas: extractGasEstimate(content),
          gasPrice: extractGasPrice(content),
          from: '' // Will be filled by user's wallet
        };
      }
    }

    // Only return parsed data if we have meaningful swap information
    return result.quote || result.approvalTransaction || result.swapTransaction ? result : null;

  } catch (error) {
    console.error('Error parsing swap data:', error);
    return null;
  }
}

/**
 * Get default token decimals based on symbol
 */
function getTokenDecimals(symbol: string): number {
  const tokenDecimals: Record<string, number> = {
    'USDC': 6,
    'USDT': 6,
    'DAI': 18,
    'WETH': 18,
    'ETH': 18,
    'WBTC': 8,
    'MATIC': 18,
    'BNB': 18,
    'AVAX': 18,
    'MOCK': 6, // For MOCK USD
    'USD': 6
  };

  return tokenDecimals[symbol.toUpperCase()] || 18;
}

/**
 * Get token logo URL
 */
function getTokenLogo(symbol: string): string | undefined {
  const logos: Record<string, string> = {
    'USDC': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441d1d5DbF72A9E0e9f8B6b659Ee99/logo.png',
    'USDT': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    'WETH': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    'ETH': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  };

  return logos[symbol.toUpperCase()];
}

/**
 * Extract gas estimate from content
 */
function extractGasEstimate(content: string): number {
  const gasMatch = content.match(GAS_PATTERN);
  if (gasMatch) {
    return parseInt(gasMatch[1].replace(/,/g, ''));
  }
  return 300000; // Default gas estimate
}

/**
 * Extract gas price from content
 */
function extractGasPrice(content: string): string {
  const gasPriceMatch = content.match(/Gas\s+Price:\s*(\d+(?:\.\d+)?)\s*Gwei/i);
  if (gasPriceMatch) {
    // Convert Gwei to Wei
    const gweiValue = parseFloat(gasPriceMatch[1]);
    return (gweiValue * 1e9).toString();
  }
  return '20000000000'; // 20 Gwei default
}

/**
 * Extract protocol information
 */
function extractProtocols(content: string): Array<{name: string, part: number, fromTokenAddress: string, toTokenAddress: string}> | undefined {
  const protocolPattern = /(\w+(?:\s+\w+)*)\s*\((\d+)%\s+of\s+trade\)/g;
  const protocols = [];
  let match;

  while ((match = protocolPattern.exec(content)) !== null) {
    protocols.push({
      name: match[1].trim(),
      part: parseInt(match[2]),
      fromTokenAddress: '', // Not typically provided in AI responses
      toTokenAddress: ''
    });
  }

  return protocols.length > 0 ? protocols : undefined;
}

/**
 * Check if content contains swap transaction information
 */
export function hasSwapData(content: string): boolean {
  return parseSwapData(content) !== null;
}