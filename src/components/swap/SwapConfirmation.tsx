import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { SwapData } from '../../types/api';
import { useExecuteSwap } from '../../hooks/services/useSwap';
import { useWalletSwap } from '../../hooks/useWalletSwap';
import { useSwapDemo } from '../../hooks/useSwapDemo';
import { oneInchService } from '../../services/oneinchService';
import { useUser } from '../../stores/userStore';

interface SwapConfirmationProps {
    swapData: SwapData;
    chatId?: string;
    messageId?: string;
    onSwapInitiated?: (swapId: string) => void;
    onCancel?: () => void;
}

export const SwapConfirmation: React.FC<SwapConfirmationProps> = ({
    swapData,
    chatId,
    messageId,
    onSwapInitiated,
    onCancel,
}) => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionStep, setExecutionStep] = useState<'preparing' | 'wallet' | 'monitoring'>('preparing');
    const [demoResult, setDemoResult] = useState<any>(null);

    const user = useUser();
    const executeSwapMutation = useExecuteSwap();
    const { executeSwapTransaction, checkWalletConnection } = useWalletSwap();
    const {
        executeSwapDemo,
        getExecutionMode,
        canExecuteSwap,
        walletConnected,
        userAuthenticated
    } = useSwapDemo();

    const handleConfirmSwap = async () => {
        if (!user?.id) {
            console.error('User not authenticated');
            return;
        }

        const executionMode = getExecutionMode();

        // If no wallet connected, run demo mode
        if (executionMode === 'demo') {
            setIsExecuting(true);
            try {
                const result = await executeSwapDemo(swapData);
                setDemoResult(result);

                if (result.success) {
                    // For demo mode, we can skip backend integration
                    console.log('Demo swap executed:', result);
                }
            } catch (error) {
                console.error('Demo execution failed:', error);
            } finally {
                setIsExecuting(false);
            }
            return;
        }

        setIsExecuting(true);
        setExecutionStep('preparing');

        try {
            // First, prepare the swap on the backend
            const result = await executeSwapMutation.mutateAsync({
                amount: swapData.amount,
                srcChainId: swapData.srcChainId,
                dstChainId: swapData.dstChainId,
                srcTokenAddress: swapData.srcTokenAddress,
                dstTokenAddress: swapData.dstTokenAddress,
                chatId,
                messageId,
            });

            if (result.success && result.data) {
                // Check if this is a user-side execution (orderHash === 'user-will-execute')
                if (result.data.orderHash === 'user-will-execute') {
                    setExecutionStep('wallet');

                    try {
                        // Get transaction data from 1inch for wallet execution
                        console.log('Getting transaction data from 1inch...');
                        const transactionData = await oneInchService.getCrossChainSwapTransaction(swapData);

                        // Execute the swap transaction with the user's wallet
                        const walletResult = await executeSwapTransaction(swapData, transactionData);

                        if (walletResult.success) {
                            console.log('Wallet transaction successful:', walletResult.transactionHash);
                            setExecutionStep('monitoring');
                            // For user-executed swaps, we can consider it completed when transaction is sent
                            onSwapInitiated?.(result.data.swapId);
                        } else {
                            throw new Error(walletResult.error || 'Wallet transaction failed');
                        }
                    } catch (transactionError: any) {
                        // If we can't get transaction data, fall back to quote-only mode explanation
                        console.error('Failed to get transaction data:', transactionError);

                        if (transactionError.message?.includes('Cross-chain swaps require backend')) {
                            // For cross-chain swaps, we need backend support
                            throw new Error('Cross-chain swaps require backend configuration. Please contact support.');
                        } else {
                            // Try with just the quote data as fallback
                            const walletResult = await executeSwapTransaction(swapData, swapData.quote);

                            if (walletResult.success) {
                                console.log('Wallet transaction successful:', walletResult.transactionHash);
                                setExecutionStep('monitoring');
                                onSwapInitiated?.(result.data.swapId);
                            } else {
                                throw new Error(walletResult.error || 'Wallet transaction failed');
                            }
                        }
                    }
                } else {
                    // Server-side execution - just monitor the order
                    setExecutionStep('monitoring');
                    onSwapInitiated?.(result.data.swapId);
                }
            }
        } catch (error) {
            console.error('Failed to execute swap:', error);
            setExecutionStep('preparing');
        } finally {
            setIsExecuting(false);
        }
    };

    const formatAmount = (amount: string, decimals: number = 18) => {
        const value = BigInt(amount);
        const divisor = BigInt(10 ** decimals);
        const quotient = value / divisor;
        const remainder = value % divisor;

        if (remainder === 0n) {
            return quotient.toString();
        }

        const remainderStr = remainder.toString().padStart(decimals, '0');
        const trimmedRemainder = remainderStr.replace(/0+$/, '');

        return trimmedRemainder ? `${quotient}.${trimmedRemainder}` : quotient.toString();
    };

    const getChainName = (chainId: number) => {
        const chains: Record<number, string> = {
            1: 'Ethereum',
            10: 'Optimism',
            56: 'BSC',
            137: 'Polygon',
            250: 'Fantom',
            8453: 'Base',
            42161: 'Arbitrum',
            43114: 'Avalanche',
        };
        return chains[chainId] || `Chain ${chainId}`;
    };

    return (
        <Card className="p-6 max-w-md mx-auto">
            <div className="space-y-4">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">Confirm Swap</h3>
                        <Badge variant={getExecutionMode() === 'demo' ? 'secondary' : 'default'}>
                            {getExecutionMode() === 'demo' ? 'Demo Mode' : 'Live Mode'}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Review the details below and confirm your swap
                    </p>
                    {getExecutionMode() === 'demo' && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Connect wallet for real transactions
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    {/* From */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">From</p>
                                <p className="font-medium">
                                    {formatAmount(swapData.amount)} {swapData.srcTokenSymbol}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">On</p>
                                <p className="font-medium">{getChainName(swapData.srcChainId)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* To */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">To</p>
                                <p className="font-medium">
                                    ~{swapData.quote.estimatedOutputFormatted} {swapData.dstTokenSymbol}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">On</p>
                                <p className="font-medium">{getChainName(swapData.dstChainId)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Quote ID: {swapData.quote.quoteId}
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ Make sure you have sufficient gas fees on both networks to complete this cross-chain swap.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onCancel}
                        disabled={isExecuting}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleConfirmSwap}
                        disabled={isExecuting}
                    >
                        {isExecuting
                            ? executionStep === 'preparing'
                                ? 'Preparing...'
                                : executionStep === 'wallet'
                                    ? 'Confirm in Wallet...'
                                    : 'Monitoring...'
                            : getExecutionMode() === 'demo'
                                ? 'Execute Demo Swap'
                                : 'Confirm Swap'
                        }
                    </Button>
                </div>

                {/* Demo Result */}
                {demoResult && (
                    <div className={`p-3 rounded-lg ${demoResult.success
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}>
                        <div className="text-sm">
                            {demoResult.success ? (
                                <>
                                    <p className="text-green-800 dark:text-green-200 font-medium">
                                        ✅ Demo Swap Successful!
                                    </p>
                                    <p className="text-green-700 dark:text-green-300 mt-1">
                                        {demoResult.message}
                                    </p>
                                    {demoResult.transactionHash && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-mono">
                                            Demo TX: {demoResult.transactionHash.slice(0, 10)}...{demoResult.transactionHash.slice(-8)}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-red-800 dark:text-red-200">
                                    ❌ {demoResult.error}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {executeSwapMutation.error && (
                    <div className="text-sm text-red-600 dark:text-red-400 text-center">
                        Error: {executeSwapMutation.error.message}
                    </div>
                )}
            </div>
        </Card>
    );
};