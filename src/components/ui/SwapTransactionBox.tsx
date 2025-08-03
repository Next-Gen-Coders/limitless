import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { ArrowRight, CheckCircle, Clock, AlertCircle, ExternalLink, Wallet } from 'lucide-react';
import { useSwap } from '../../hooks/useSwap';
import { SwapTransactionStatus, type SwapQuoteData, type SwapTransactionData, type ApprovalTransactionData } from '../../types/swap';
import { formatUnits } from 'viem';
import { useLogin } from '@privy-io/react-auth';

interface SwapTransactionBoxProps {
  quote: SwapQuoteData;
  approvalTransaction?: ApprovalTransactionData;
  swapTransaction?: SwapTransactionData;
  spenderAddress?: string;
  needsApproval?: boolean;
  chainName: string;
  className?: string;
}

const SwapTransactionBox: React.FC<SwapTransactionBoxProps> = ({
  quote,
  swapTransaction,
  spenderAddress,
  needsApproval = false,
  chainName,
  className = ''
}) => {
  const { login } = useLogin();
  
  // Get target chain ID from chain name
  const getChainId = (name: string): number | undefined => {
    const normalizedName = name.toLowerCase();
    
    // Direct mapping to chain IDs
    const chainMappings: Record<string, number> = {
      'ethereum': 1,
      'polygon': 137,
      'arbitrum': 42161,
      'base': 8453,
      'optimism': 10,
      'bsc': 56,
      'avalanche': 43114,
      // Alternative names
      'eth': 1,
      'poly': 137,
      'matic': 137,
      'arb': 42161,
      'avax': 43114,
      'bnb': 56,
      'opt': 10
    };
    
    return chainMappings[normalizedName];
  };
  
  const targetChainId = getChainId(chainName);

  const {
    status,
    approvalTxHash,
    swapTxHash,
    isConnected,
    userAddress,
    isCorrectChain,
    executeApproval,
    executeSwap,
    switchToTargetChain,
    canApprove,
    canSwap,
    isApproving,
    isSwapping,
    isCompleted,
    isFailed,
    reset
  } = useSwap({
    quote,
    swapTransaction,
    spenderAddress,
    needsApproval,
    targetChainId
  });

  // Format token amounts for display
  const srcAmount = formatUnits(BigInt(quote.srcAmount), quote.srcToken.decimals);
  const dstAmount = formatUnits(BigInt(quote.dstAmount), quote.dstToken.decimals);

  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case SwapTransactionStatus.IDLE:
        return <Badge variant="secondary">Ready</Badge>;
      case SwapTransactionStatus.APPROVING:
        return <Badge variant="outline" className="text-blue-600"><Clock className="w-3 h-3 mr-1" />Approving</Badge>;
      case SwapTransactionStatus.APPROVED:
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case SwapTransactionStatus.SWAPPING:
        return <Badge variant="outline" className="text-blue-600"><Clock className="w-3 h-3 mr-1" />Swapping</Badge>;
      case SwapTransactionStatus.COMPLETED:
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case SwapTransactionStatus.FAILED:
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Get explorer URL for transaction hash
  const getExplorerUrl = (txHash: string) => {
    const baseUrls: Record<number, string> = {
      1: 'https://etherscan.io/tx/',
      137: 'https://polygonscan.com/tx/',
      42161: 'https://arbiscan.io/tx/',
      8453: 'https://basescan.org/tx/',
      10: 'https://optimistic.etherscan.io/tx/',
      56: 'https://bscscan.com/tx/',
      43114: 'https://snowtrace.io/tx/'
    };
    return targetChainId ? baseUrls[targetChainId] + txHash : '#';
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto border-2 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Token Swap on {chainName}</CardTitle>
            <CardDescription className="mt-1">
              Execute your token swap transaction
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Swap Details */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-semibold">{srcAmount} {quote.srcToken.symbol}</span>
                <span className="text-sm text-muted-foreground">{quote.srcToken.address}</span>
              </div>
            </div>
            
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            
            <div className="flex items-center space-x-3">
              <div className="flex flex-col text-right">
                <span className="font-semibold">{dstAmount} {quote.dstToken.symbol}</span>
                <span className="text-sm text-muted-foreground">{quote.dstToken.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gas and Network Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Estimated Gas:</span>
            <span className="font-medium">{quote.gas.toLocaleString()} units</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Network:</span>
            <span className="font-medium">{chainName}</span>
          </div>
        </div>

        {/* Protocol Info */}
        {quote.protocols && quote.protocols.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Route:</span>
            <div className="flex flex-wrap gap-2">
              {quote.protocols.map((protocol, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {protocol.name} ({protocol.part}%)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Connect your wallet to proceed</span>
            </div>
            <Button 
              onClick={login} 
              className="mt-3 w-full"
              variant="outline"
            >
              Connect Wallet
            </Button>
          </div>
        ) : !isCorrectChain ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Switch to {chainName} network</span>
            </div>
            <Button 
              onClick={switchToTargetChain} 
              className="mt-3 w-full"
              variant="outline"
            >
              Switch Network
            </Button>
          </div>
        ) : (
          <>
            {/* Connected Wallet Info */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Connected: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {needsApproval && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Step 1: Approve Token Spending</span>
                    {status === SwapTransactionStatus.APPROVED && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <Button
                    onClick={executeApproval}
                    disabled={!canApprove || isApproving}
                    className="w-full"
                    variant={status === SwapTransactionStatus.APPROVED ? "secondary" : "default"}
                  >
                    {isApproving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Approving...
                      </>
                    ) : status === SwapTransactionStatus.APPROVED ? (
                      "Approved ✓"
                    ) : (
                      `Approve ${quote.srcToken.symbol}`
                    )}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {needsApproval ? 'Step 2: Execute Swap' : 'Execute Swap'}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <Button
                  onClick={executeSwap}
                  disabled={!canSwap || isSwapping}
                  className="w-full"
                  variant={isCompleted ? "secondary" : "default"}
                >
                  {isSwapping ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Swapping...
                    </>
                  ) : isCompleted ? (
                    "Swap Completed ✓"
                  ) : (
                    `Swap ${quote.srcToken.symbol} → ${quote.dstToken.symbol}`
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Transaction Hashes */}
        {(approvalTxHash || swapTxHash) && (
          <div className="space-y-2 pt-4 border-t border-border">
            <span className="text-sm font-medium">Transaction Hashes:</span>
            {approvalTxHash && (
              <div className="flex items-center justify-between bg-muted/30 rounded p-2">
                <span className="text-sm">Approval:</span>
                <a
                  href={getExplorerUrl(approvalTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:underline"
                >
                  <span>{approvalTxHash.slice(0, 6)}...{approvalTxHash.slice(-4)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {swapTxHash && (
              <div className="flex items-center justify-between bg-muted/30 rounded p-2">
                <span className="text-sm">Swap:</span>
                <a
                  href={getExplorerUrl(swapTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:underline"
                >
                  <span>{swapTxHash.slice(0, 6)}...{swapTxHash.slice(-4)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {isFailed && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Transaction failed</span>
            </div>
            <Button 
              onClick={reset} 
              className="mt-3 w-full"
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SwapTransactionBox;