// Demo mode hook for handling swap functionality in different modes
import { useState, useCallback } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import type { SwapData } from "../types/api";

export interface SwapDemoResult {
  success: boolean;
  mode: "demo" | "wallet" | "backend";
  transactionHash?: string;
  message?: string;
  error?: string;
}

export const useSwapDemo = () => {
  const { wallets } = useWallets();
  const { authenticated, user } = usePrivy();
  const [isExecuting, setIsExecuting] = useState(false);

  const executeSwapDemo = useCallback(
    async (swapData: SwapData): Promise<SwapDemoResult> => {
      if (!authenticated) {
        return {
          success: false,
          mode: "demo",
          error: "Please connect your wallet to execute swaps",
        };
      }

      setIsExecuting(true);

      try {
        // Simulate successful transaction for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Generate a demo transaction hash
        const demoTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

        return {
          success: true,
          mode: "demo",
          transactionHash: demoTxHash,
          message: `Demo swap executed! Would swap ${formatAmount(
            swapData.amount
          )} ${swapData.srcTokenSymbol} for ~${
            swapData.quote.estimatedOutputFormatted
          } ${swapData.dstTokenSymbol}`,
        };
      } catch (error: any) {
        return {
          success: false,
          mode: "demo",
          error: error.message || "Demo execution failed",
        };
      } finally {
        setIsExecuting(false);
      }
    },
    [authenticated]
  );

  const formatAmount = (amount: string, decimals: number = 18) => {
    try {
      const value = BigInt(amount);
      const divisor = BigInt(10 ** decimals);
      const quotient = value / divisor;
      const remainder = value % divisor;

      if (remainder === 0n) {
        return quotient.toString();
      }

      const remainderStr = remainder.toString().padStart(decimals, "0");
      const trimmedRemainder = remainderStr.replace(/0+$/, "");

      return trimmedRemainder
        ? `${quotient}.${trimmedRemainder}`
        : quotient.toString();
    } catch {
      return amount;
    }
  };

  const getExecutionMode = useCallback(() => {
    if (!authenticated) return "demo";
    if (wallets.length === 0) return "demo";
    return "wallet";
  }, [authenticated, wallets.length]);

  const canExecuteSwap = useCallback(() => {
    return authenticated && wallets.length > 0;
  }, [authenticated, wallets.length]);

  return {
    executeSwapDemo,
    getExecutionMode,
    canExecuteSwap,
    isExecuting,
    walletConnected: wallets.length > 0,
    userAuthenticated: authenticated,
  };
};
