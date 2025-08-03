// Frontend service for 1inch API integration
// This handles getting quotes and transaction data directly from 1inch

import type { SwapData } from "../types/api";

interface OneInchQuoteParams {
  amount: string;
  srcChainId: number;
  dstChainId: number;
  srcTokenAddress: string;
  dstTokenAddress: string;
  walletAddress: string;
}

interface OneInchTransactionParams extends OneInchQuoteParams {
  slippage?: number;
}

export class OneInchService {
  private static instance: OneInchService;
  private baseUrl = "https://api.1inch.dev";

  static getInstance(): OneInchService {
    if (!OneInchService.instance) {
      OneInchService.instance = new OneInchService();
    }
    return OneInchService.instance;
  }

  // Get a quote for display purposes
  async getQuote(params: OneInchQuoteParams) {
    try {
      const url = new URL(
        `${this.baseUrl}/swap/v5.2/${params.srcChainId}/quote`
      );
      url.searchParams.append("src", params.srcTokenAddress);
      url.searchParams.append("dst", params.dstTokenAddress);
      url.searchParams.append("amount", params.amount);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`1inch API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("1inch quote error:", error);
      throw error;
    }
  }

  // Get transaction data for wallet execution
  async getSwapTransaction(params: OneInchTransactionParams) {
    try {
      const url = new URL(
        `${this.baseUrl}/swap/v5.2/${params.srcChainId}/swap`
      );
      url.searchParams.append("src", params.srcTokenAddress);
      url.searchParams.append("dst", params.dstTokenAddress);
      url.searchParams.append("amount", params.amount);
      url.searchParams.append("from", params.walletAddress);
      url.searchParams.append("slippage", (params.slippage || 1).toString());
      url.searchParams.append("disableEstimate", "true");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`1inch API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("1inch transaction error:", error);
      throw error;
    }
  }

  // Enhanced method that gets transaction data for cross-chain swaps
  async getCrossChainSwapTransaction(swapData: SwapData) {
    try {
      // For cross-chain swaps, we need to handle differently
      // This is a simplified implementation - real cross-chain swaps
      // would need the 1inch Fusion SDK

      if (swapData.srcChainId === swapData.dstChainId) {
        // Same chain swap - use regular swap endpoint
        return await this.getSwapTransaction({
          amount: swapData.amount,
          srcChainId: swapData.srcChainId,
          dstChainId: swapData.dstChainId,
          srcTokenAddress: swapData.srcTokenAddress,
          dstTokenAddress: swapData.dstTokenAddress,
          walletAddress: swapData.walletAddress,
        });
      } else {
        // Cross-chain swap - would need Fusion SDK integration
        // For now, return an error indicating this needs backend support
        throw new Error(
          "Cross-chain swaps require backend integration with 1inch Fusion SDK"
        );
      }
    } catch (error) {
      console.error("Cross-chain swap error:", error);
      throw error;
    }
  }
}

export const oneInchService = OneInchService.getInstance();
