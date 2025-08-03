import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSwapStatusPolling } from '../../hooks/services/useSwap';

interface SwapStatusProps {
    swapId: string;
    onComplete?: () => void;
}

export const SwapStatus: React.FC<SwapStatusProps> = ({ swapId, onComplete }) => {
    const { data: statusData, isLoading, error } = useSwapStatusPolling(swapId);

    const swapTransaction = statusData?.data;

    React.useEffect(() => {
        if (swapTransaction?.status === 'completed' && onComplete) {
            onComplete();
        }
    }, [swapTransaction?.status, onComplete]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Swap is being prepared...';
            case 'processing':
                return 'Swap is being executed on the blockchain...';
            case 'completed':
                return 'Swap completed successfully!';
            case 'failed':
                return 'Swap failed. Please try again.';
            default:
                return 'Unknown status';
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

    if (isLoading) {
        return (
            <Card className="p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading swap status...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-4">
                <div className="text-sm text-red-600 dark:text-red-400">
                    Error loading swap status: {error.message}
                </div>
            </Card>
        );
    }

    if (!swapTransaction) {
        return (
            <Card className="p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Swap not found
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <div className="space-y-3">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Swap Status</h4>
                    <Badge className={getStatusColor(swapTransaction.status)}>
                        {swapTransaction.status}
                    </Badge>
                </div>

                {/* Status Message */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getStatusMessage(swapTransaction.status)}
                </p>

                {/* Swap Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                        <span>{formatAmount(swapTransaction.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">From Chain:</span>
                        <span>{getChainName(swapTransaction.srcChainId)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">To Chain:</span>
                        <span>{getChainName(swapTransaction.dstChainId)}</span>
                    </div>
                    {swapTransaction.orderHash && swapTransaction.orderHash !== 'user-will-execute' && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Order Hash:</span>
                            <span className="font-mono text-xs truncate max-w-32">
                                {swapTransaction.orderHash}
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress Indicator */}
                {(swapTransaction.status === 'pending' || swapTransaction.status === 'processing') && (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Updating every 5 seconds...
                        </span>
                    </div>
                )}

                {/* Error Details */}
                {swapTransaction.status === 'failed' && swapTransaction.errorDetails && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded text-sm">
                        <strong className="text-red-800 dark:text-red-200">Error:</strong>
                        <p className="text-red-700 dark:text-red-300 mt-1">
                            {swapTransaction.errorDetails.error || 'Unknown error occurred'}
                        </p>
                    </div>
                )}

                {/* Success Message */}
                {swapTransaction.status === 'completed' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 rounded text-sm">
                        <p className="text-green-800 dark:text-green-200">
                            ✅ Your cross-chain swap has been completed successfully!
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};