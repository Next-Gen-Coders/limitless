import React from 'react';
import SwapTransactionBox from './ui/SwapTransactionBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { SwapQuoteData, SwapTransactionData } from '../types/swap';

// Example swap data that would come from the AI backend
const exampleSwapQuote: SwapQuoteData = {
  srcToken: {
    symbol: 'USDC',
    address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441d1d5DbF72A9E0e9f8B6b659Ee99/logo.png'
  },
  dstToken: {
    symbol: 'WETH',
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  srcAmount: '10000000', // 10 USDC (6 decimals)
  dstAmount: '2864270000000000', // ~0.00286427 WETH (18 decimals)
  gas: 371962,
  gasPrice: '129850000000', // 129.85 Gwei
  protocols: [
    {
      name: 'Uniswap V3',
      part: 80,
      fromTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      toTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
    },
    {
      name: 'Curve',
      part: 20,
      fromTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      toTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
    }
  ]
};

const exampleSwapTransaction: SwapTransactionData = {
  to: '0x111111125421ca6dc452d289314280a0f8842a65', // 1inch router
  data: '0x0502b1c5000000000000000000000000a0b86a33e6441d1d5dbf72a9e0e9f8b6b659ee99000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000027f7274e72000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000140000000000000000203b1c5b0b2fe5e7b4b6b659ee9900a0b86a3396b659ee9900000000000000000000000000000000000000000000000000000000000000',
  value: '0',
  gas: 371962,
  gasPrice: '129850000000',
  from: '' // Will be filled by user's wallet
};

/**
 * Demo component to showcase the SwapTransactionBox
 * This simulates how the component would be used when AI detects swap intent
 */
const SwapDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔄 Limitless AI Swap Integration Demo</CardTitle>
          <CardDescription>
            This demonstrates how swap transactions are presented to users when the AI detects swap intent.
            The component below would normally be rendered within an AI message.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Simulated AI Response:</h4>
              <p className="text-sm text-muted-foreground">
                "Here is your swap quote to exchange 10 USDC for WETH on Polygon:
                <br /><br />
                You will receive approximately 0.00286427 WETH in exchange for 10 USDC.
                The current rate is 1 USDC ≈ 0.000286 WETH.
                <br /><br />
                To proceed with this swap, you first need to approve the 1inch router to spend your USDC."
              </p>
            </div>
            
            {/* This is where the SwapTransactionBox would be rendered */}
            <SwapTransactionBox
              quote={exampleSwapQuote}
              swapTransaction={exampleSwapTransaction}
              spenderAddress="0x111111125421ca6dc452d289314280a0f8842a65"
              needsApproval={true}
              chainName="Polygon"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Integration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Features Implemented:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Wallet connection integration</li>
                <li>• Network switching support</li>
                <li>• Token approval workflow</li>
                <li>• Swap execution with transaction tracking</li>
                <li>• Real-time status updates</li>
                <li>• Transaction hash links to explorers</li>
                <li>• Error handling and retry functionality</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">🔧 Technical Implementation:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• TypeScript interfaces for swap data</li>
                <li>• Wagmi hooks for blockchain interactions</li>
                <li>• Privy for wallet authentication</li>
                <li>• React Hot Toast for notifications</li>
                <li>• Automatic content parsing in AI messages</li>
                <li>• Support for multiple chains</li>
                <li>• Gas estimation and price optimization</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 How it works:</h4>
            <ol className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
              <li>1. User asks AI for a token swap quote</li>
              <li>2. AI calls the backend classicSwapTool</li>
              <li>3. Backend returns quote and transaction data</li>
              <li>4. Frontend parses the AI response</li>
              <li>5. SwapTransactionBox renders with parsed data</li>
              <li>6. User connects wallet and executes transactions</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwapDemo;