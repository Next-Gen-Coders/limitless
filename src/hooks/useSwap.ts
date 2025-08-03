import { useState, useCallback } from 'react';
import { useWriteContract, useAccount, useChainId, useSwitchChain } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import toast from 'react-hot-toast';
import { SwapTransactionStatus, NATIVE_TOKEN_ADDRESS, type SwapQuoteData, type SwapTransactionData } from '../types/swap';

// ERC20 ABI for approve function
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

interface UseSwapProps {
  quote?: SwapQuoteData;
  swapTransaction?: SwapTransactionData;
  spenderAddress?: string;
  needsApproval?: boolean;
  targetChainId?: number;
}

export const useSwap = ({
  quote,
  swapTransaction,
  spenderAddress,
  needsApproval = false,
  targetChainId
}: UseSwapProps) => {
  const [status, setStatus] = useState<SwapTransactionStatus>(SwapTransactionStatus.IDLE);
  const [approvalTxHash, setApprovalTxHash] = useState<string>('');
  const [swapTxHash, setSwapTxHash] = useState<string>('');

  const { address: userAddress, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  const {
    writeContractAsync: writeContract,
    isPending: isWritePending
  } = useWriteContract();

  // Check if we're on the correct chain
  const isCorrectChain = !targetChainId || currentChainId === targetChainId;

  const switchToTargetChain = useCallback(async () => {
    if (!targetChainId || currentChainId === targetChainId) return true;
    
    try {
      await switchChain({ chainId: targetChainId });
      return true;
    } catch (error) {
      console.error('Failed to switch chain:', error);
      toast.error('Failed to switch to the required network');
      return false;
    }
  }, [targetChainId, currentChainId, switchChain]);

  const executeApproval = useCallback(async () => {
    if (!isConnected || !userAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!quote || !spenderAddress) {
      toast.error('Missing approval data');
      return;
    }

    try {
      setStatus(SwapTransactionStatus.APPROVING);

      // Switch to target chain if needed
      const chainSwitched = await switchToTargetChain();
      if (!chainSwitched) {
        setStatus(SwapTransactionStatus.FAILED);
        return;
      }

      // Check if token is native (ETH, MATIC, etc.)
      if (quote.srcToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
        toast.error('Native tokens do not require approval');
        setStatus(SwapTransactionStatus.APPROVED);
        return;
      }

      // Calculate approval amount
      const approvalAmount = parseUnits(
        formatUnits(BigInt(quote.srcAmount), quote.srcToken.decimals),
        quote.srcToken.decimals
      );
      // Execute approval transaction
      const txHash = await writeContract({
        address: quote.srcToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, approvalAmount]
      });

      setApprovalTxHash(txHash);
      setStatus(SwapTransactionStatus.APPROVED);
      toast.success('Approval transaction submitted!');

    } catch (error) {
      console.error('Approval failed:', error);
      setStatus(SwapTransactionStatus.FAILED);
      toast.error(error instanceof Error ? error.message : 'Approval failed');
    }
  }, [isConnected, userAddress, quote, spenderAddress, writeContract, switchToTargetChain]);

  const executeSwap = useCallback(async () => {
    if (!isConnected || !userAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!swapTransaction) {
      toast.error('Missing swap transaction data');
      return;
    }

    try {
      setStatus(SwapTransactionStatus.SWAPPING);

      // Switch to target chain if needed
      const chainSwitched = await switchToTargetChain();
      if (!chainSwitched) {
        setStatus(SwapTransactionStatus.FAILED);
        return;
      }

      // Execute swap transaction by sending raw transaction
      // For now, we'll use a simple approach - in a real implementation,
      // you'd want to use viem's sendTransaction or similar
      const txHash = await writeContract({
        address: swapTransaction.to as `0x${string}`,
        abi: [{
          name: 'fallback',
          type: 'fallback',
          stateMutability: 'payable'
        }] as const,
        functionName: 'fallback',
        value: BigInt(swapTransaction.value)
      });

      setSwapTxHash(txHash);
      setStatus(SwapTransactionStatus.COMPLETED);
      toast.success('Swap transaction submitted!');

    } catch (error) {
      console.error('Swap failed:', error);
      setStatus(SwapTransactionStatus.FAILED);
      toast.error(error instanceof Error ? error.message : 'Swap failed');
    }
  }, [isConnected, userAddress, swapTransaction, writeContract, switchToTargetChain]);

  const reset = useCallback(() => {
    setStatus(SwapTransactionStatus.IDLE);
    setApprovalTxHash('');
    setSwapTxHash('');
  }, []);

  return {
    // State
    status,
    approvalTxHash,
    swapTxHash,
    isWritePending,
    isConnected,
    userAddress,
    isCorrectChain,

    // Actions
    executeApproval,
    executeSwap,
    switchToTargetChain,
    reset,

    // Computed values
    canApprove: isConnected && needsApproval && status === SwapTransactionStatus.IDLE,
    canSwap: isConnected && (!needsApproval || status === SwapTransactionStatus.APPROVED) && swapTransaction,
    isApproving: status === SwapTransactionStatus.APPROVING,
    isSwapping: status === SwapTransactionStatus.SWAPPING,
    isCompleted: status === SwapTransactionStatus.COMPLETED,
    isFailed: status === SwapTransactionStatus.FAILED
  };
};