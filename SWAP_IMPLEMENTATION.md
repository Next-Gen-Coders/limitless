# Swap Transaction Integration (Legacy)

⚠️ **Note**: This document describes the original text-parsing implementation. The current system uses structured JSON responses. See `STRUCTURED_SWAP_IMPLEMENTATION.md` for the updated documentation.

This document describes the implementation of the swap transaction feature that integrates with the Limitless AI backend to provide a seamless token swapping experience.

## Overview

The swap transaction feature allows users to execute token swaps directly from AI chat responses. When the AI detects swap intent and provides transaction details, a beautiful UI component appears with approve and swap buttons that connect to the user's wallet.

## Architecture

### Backend Integration
- Uses the existing `classicSwapTool.ts` from the server
- Leverages 1inch API for optimal swap routes
- Supports multiple blockchain networks
- Provides both quote and transaction calldata generation

### Frontend Components

#### 1. Type Definitions (`src/types/swap.ts`)
- `SwapQuoteData`: Token information and amounts
- `SwapTransactionData`: Transaction calldata and parameters
- `SwapRequest/Response`: API communication interfaces
- `SwapTransactionStatus`: State management enums

#### 2. Swap Hook (`src/hooks/useSwap.ts`)
- Manages swap transaction lifecycle
- Handles wallet connections and network switching
- Executes approval and swap transactions
- Provides real-time status updates
- Includes error handling and retry logic

#### 3. SwapTransactionBox Component (`src/components/ui/SwapTransactionBox.tsx`)
- Main UI component for swap transactions
- Shows token swap details and route information
- Wallet connection and network switching buttons
- Step-by-step transaction execution (approve → swap)
- Transaction hash links to block explorers
- Responsive design with loading and error states

#### 4. Content Parser (`src/utils/swapParser.ts`)
- Parses AI message content to extract swap data
- Detects transaction details from text responses
- Maps token symbols to addresses and decimals
- Extracts gas estimates and protocol information

#### 5. AI Message Integration (`src/components/chat/AiMsg.tsx`)
- Automatically detects swap content in AI responses
- Renders SwapTransactionBox when appropriate
- Cleans up technical details that are now in the UI
- Maintains existing chart and address detection features

## Usage Flow

### 1. User Interaction
```
User: "Get a quote to swap 10 USDC for WETH on Polygon"
```

### 2. AI Processing
The AI uses the backend `classicSwapTool` to:
- Get quote from 1inch API
- Calculate optimal route
- Generate approval transaction (if needed)
- Prepare swap transaction calldata

### 3. Response Rendering
The frontend:
- Parses the AI response for swap data
- Renders the SwapTransactionBox component
- Shows clean text without technical details

### 4. Transaction Execution
User can:
- Connect wallet (via Privy)
- Switch to correct network
- Approve token spending
- Execute the swap
- View transaction hashes

## Features

### ✅ Implemented
- **Multi-chain Support**: Ethereum, Polygon, Arbitrum, Base, Optimism, BSC, Avalanche
- **Wallet Integration**: Privy authentication with wagmi for transactions
- **Network Switching**: Automatic prompt to switch to correct network
- **Token Approval**: ERC-20 approval workflow with allowance checking
- **Transaction Tracking**: Real-time status updates and transaction hashes
- **Error Handling**: Comprehensive error states with retry functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Gas Optimization**: Uses backend gas estimates
- **Protocol Routes**: Shows DEX routing information
- **Explorer Links**: Direct links to transaction details

### 🔮 Future Enhancements
- **Slippage Settings**: User-configurable slippage tolerance
- **MEV Protection**: Integration with flashbots or similar
- **Price Impact Warning**: Alert for high impact swaps
- **Transaction Simulation**: Preview transaction results
- **Historical Tracking**: Swap history and analytics
- **Cross-chain Swaps**: Bridge integration for cross-chain swaps

## Configuration

### Environment Variables
Add to your `.env.local`:
```env
VITE_PRIVY_APP_ID=your_privy_app_id
```

### Dependencies
The implementation uses:
- `wagmi` - Ethereum library
- `viem` - TypeScript Ethereum library
- `@privy-io/react-auth` - Wallet authentication
- `react-hot-toast` - Notifications
- `lucide-react` - Icons

## Demo

To see the swap functionality in action, add the `SwapDemo` component to any page:

```tsx
import SwapDemo from '../components/SwapDemo';

function DemoPage() {
  return <SwapDemo />;
}
```

## Code Examples

### Basic Usage
```tsx
import SwapTransactionBox from './components/ui/SwapTransactionBox';

<SwapTransactionBox
  quote={swapQuote}
  swapTransaction={swapTransaction}
  spenderAddress="0x111111125421ca6dc452d289314280a0f8842a65"
  needsApproval={true}
  chainName="Polygon"
/>
```

### Parsing AI Content
```tsx
import { parseSwapData, hasSwapData } from './utils/swapParser';

const aiMessage = "Here's your swap quote...";
if (hasSwapData(aiMessage)) {
  const swapData = parseSwapData(aiMessage);
  // Render SwapTransactionBox with parsed data
}
```

### Custom Hook Usage
```tsx
import { useSwap } from './hooks/useSwap';

const {
  status,
  executeApproval,
  executeSwap,
  isApproving,
  isSwapping
} = useSwap({
  quote,
  swapTransaction,
  needsApproval: true
});
```

## Security Considerations

1. **Transaction Verification**: Always verify transaction details before signing
2. **Network Validation**: Ensure correct network before executing
3. **Allowance Management**: Only approve necessary amounts
4. **Error Handling**: Graceful handling of failed transactions
5. **User Confirmation**: Clear indication of transaction status

## Testing

To test the swap functionality:

1. **Start the Development Server**
   ```bash
   cd client && npm run dev
   ```

2. **Test with Demo Component**
   - Add `<SwapDemo />` to a test page
   - Connect wallet via Privy
   - Try approval and swap buttons

3. **Test AI Integration**
   - Ask AI for swap quotes
   - Verify SwapTransactionBox appears
   - Check transaction execution flow

## Troubleshooting

### Common Issues

1. **Wallet Not Connected**
   - Ensure Privy is properly configured
   - Check VITE_PRIVY_APP_ID environment variable

2. **Wrong Network**
   - Component will prompt to switch networks
   - Ensure wallet supports target chain

3. **Insufficient Allowance**
   - Approval step will handle this automatically
   - Check token balance before swapping

4. **Transaction Failures**
   - Check gas settings and network congestion
   - Verify token addresses and amounts
   - Review slippage tolerance

### Debug Mode
Enable debug logging by adding to console:
```javascript
localStorage.setItem('debug', 'swap:*');
```

This implementation provides a complete, production-ready swap transaction feature that seamlessly integrates with the existing Limitless AI chat interface.