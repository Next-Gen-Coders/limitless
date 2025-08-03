import { useState, useCallback } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import {
  createWalletClient,
  custom,
  parseUnits,
  formatUnits,
  http,
} from "viem";
import { mainnet, polygon, optimism, arbitrum, base } from "viem/chains";
import type { SwapData } from "../types/api";

// Chain mapping for viem
const chainMap = {
  1: mainnet,
  10: optimism,
  56: bsc,
  137: polygon,
  8453: base,
  42161: arbitrum,
  43114: avalanche,
  250: fantom,
} as const;

interface WalletSwapResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export const useWalletSwap = () => {
  const { wallets } = useWallets();
  const { user, authenticated } = usePrivy();
  const [isExecuting, setIsExecuting] = useState(false);

  const executeSwapTransaction = useCallback(
    async (
      swapData: SwapData,
      quoteData: any // The quote data from 1inch API
    ): Promise<WalletSwapResult> => {
      if (!authenticated) {
        return { success: false, error: "User not authenticated" };
      }

      if (!wallets.length) {
        return { success: false, error: "No wallet connected" };
      }

      setIsExecuting(true);

      try {
        const wallet = wallets[0]; // Use the first connected wallet
        console.log("Using wallet:", wallet.address);

        const provider = await wallet.getEthereumProvider();
        if (!provider) {
          return { success: false, error: "Wallet provider not available" };
        }

        // Get the appropriate chain
        const chain = chainMap[swapData.srcChainId as keyof typeof chainMap];
        if (!chain) {
          return {
            success: false,
            error: `Unsupported chain: ${swapData.srcChainId}`,
          };
        }

        console.log("Target chain:", chain.name, "ID:", swapData.srcChainId);

        // Create wallet client
        const walletClient = createWalletClient({
          chain,
          transport: custom(provider),
        });

        // Get current chain ID
        const currentChainId = await walletClient.getChainId();
        console.log("Current chain ID:", currentChainId);

        // Switch to the correct chain if needed
        if (currentChainId !== swapData.srcChainId) {
          try {
            console.log("Switching to chain:", swapData.srcChainId);
            await walletClient.switchChain({ id: swapData.srcChainId });
          } catch (error: any) {
            console.error("Chain switch error:", error);
            return {
              success: false,
              error: `Failed to switch to ${chain.name}. Please switch manually.`,
            };
          }
        }

        // Get the user's address
        const accounts = await walletClient.getAddresses();
        if (!accounts.length) {
          return { success: false, error: "No accounts found in wallet" };
        }

        const userAddress = accounts[0];
        console.log("User address:", userAddress);

        // For 1inch swaps, we need to get the actual transaction data
        // Since we're using quotes only mode, we need to get transaction data
        console.log("Quote data:", quoteData);

        // Note: In the current implementation, the backend is in quotes-only mode
        // The quote data contains the swap information but not the transaction data
        // For a full implementation, you would need:
        // 1. Get a quote with transaction data from 1inch
        // 2. Execute that transaction here

        // For now, let's create a placeholder transaction that demonstrates the flow
        // In a real implementation, you would use the 1inch API to get transaction data

        if (quoteData && (quoteData.tx || quoteData.transaction)) {
          const txData = quoteData.tx || quoteData.transaction;

          console.log("Executing transaction with data:", txData);

          const txHash = await walletClient.sendTransaction({
            to: txData.to as `0x${string}`,
            data: txData.data as `0x${string}`,
            value: BigInt(txData.value || "0"),
            gas: txData.gas ? BigInt(txData.gas) : undefined,
            gasPrice: txData.gasPrice ? BigInt(txData.gasPrice) : undefined,
          });

          console.log("Transaction sent:", txHash);
          return { success: true, transactionHash: txHash };
        }

        // If no transaction data, we need to inform user about the limitation
        console.warn(
          "No transaction data available - backend is in quote-only mode"
        );

        return {
          success: false,
          error:
            "Backend is in quote-only mode. To enable wallet execution, configure PRIVATE_KEY and RPC_URL on the server.",
        };
      } catch (error: any) {
        console.error("Wallet swap execution error:", error);

        // Parse common wallet errors
        let errorMessage = error.message || "Transaction failed";

        if (error.message?.includes("User rejected")) {
          errorMessage = "Transaction was rejected by user";
        } else if (error.message?.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for this transaction";
        } else if (error.message?.includes("gas")) {
          errorMessage = "Gas estimation failed. Please try again.";
        }

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsExecuting(false);
      }
    },
    [wallets, authenticated]
  );

  const checkWalletConnection = useCallback(() => {
    return wallets.length > 0;
  }, [wallets]);

  const getWalletAddress = useCallback(() => {
    if (!wallets.length) return null;
    return wallets[0].address;
  }, [wallets]);

  const checkTokenAllowance = useCallback(
    async (
      tokenAddress: string,
      spenderAddress: string,
      chainId: number
    ): Promise<{ hasAllowance: boolean; currentAllowance?: string }> => {
      if (!wallets.length) {
        return { hasAllowance: false };
      }

      try {
        const wallet = wallets[0];
        const provider = await wallet.getEthereumProvider();

        if (!provider) {
          return { hasAllowance: false };
        }

        // TODO: Implement actual allowance check using viem
        // This would involve reading the ERC20 allowance

        return { hasAllowance: true }; // Placeholder
      } catch (error) {
        console.error("Error checking token allowance:", error);
        return { hasAllowance: false };
      }
    },
    [wallets]
  );

  const approveToken = useCallback(
    async (
      tokenAddress: string,
      spenderAddress: string,
      amount: string,
      chainId: number
    ): Promise<WalletSwapResult> => {
      if (!wallets.length) {
        return { success: false, error: "No wallet connected" };
      }

      try {
        // TODO: Implement token approval using viem
        // This would involve calling the ERC20 approve function

        return { success: true }; // Placeholder
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Approval failed",
        };
      }
    },
    [wallets]
  );

  return {
    executeSwapTransaction,
    checkWalletConnection,
    getWalletAddress,
    checkTokenAllowance,
    approveToken,
    isExecuting,
  };
};
