export const dummyResponses = {
  portfolio: {
    content: `# Portfolio Overview

## Current Balance
- **Total Value**: $12,450.67
- **24h Change**: +$234.12 (+1.92%)

## Asset Allocation
| Asset | Amount | Value | 24h Change |
|-------|--------|-------|------------|
| ETH | 2.45 | $8,234.50 | +2.1% |
| USDC | 3,200 | $3,200.00 | +0.0% |
| MATIC | 1,250 | $1,016.17 | +3.2% |

## Recent Transactions
- **2 hours ago**: Received 0.5 ETH from 0x1234...5678
- **1 day ago**: Sent 100 USDC to 0xabcd...efgh
- **3 days ago**: Swapped 0.1 ETH for 1,250 MATIC

---

## Portfolio Analytics
Your portfolio is performing well with a **diversified mix** of assets. The recent ETH price increase has contributed to your positive 24h performance.

### Recommendations
- Consider **rebalancing** if ETH exceeds 70% of your portfolio
- **DCA** into stablecoins during market volatility
- Monitor **gas fees** before making small transactions

Would you like me to help you with any specific transactions or portfolio analysis?`,
  },
  send: {
    content: `# Transaction Details

## Send 0.1 ETH
- **Amount**: 0.1 ETH
- **Current Value**: $336.20
- **Gas Fee**: ~$12.50 (estimated)
- **Total Cost**: $348.70

## Transaction Summary
| Field | Value |
|-------|-------|
| To Address | 0x1234...5678 |
| Amount | 0.1 ETH |
| Network | Ethereum Mainnet |
| Gas Limit | 21,000 |
| Gas Price | 25 Gwei |

## Confirmation
✅ **Sufficient Balance**: You have 2.45 ETH available
✅ **Gas Fee**: Covered by your wallet
✅ **Address Valid**: Recipient address is valid

---

## Next Steps
1. **Review** the transaction details above
2. **Confirm** the recipient address is correct
3. **Execute** the transaction

**Note**: This transaction will be processed on the Ethereum mainnet and may take 1-3 minutes to confirm.

Would you like me to proceed with this transaction?`,
  },
  analyze: {
    content: `# Token Performance Analysis

## ETH (Ethereum)
- **Current Price**: $3,362.00
- **24h Change**: +$67.20 (+2.04%)
- **7d Change**: +$134.40 (+4.16%)
- **Market Cap**: $404.2B

### Technical Indicators
- **RSI**: 58 (Neutral)
- **MACD**: Bullish crossover
- **Support**: $3,200
- **Resistance**: $3,500

## MATIC (Polygon)
- **Current Price**: $0.813
- **24h Change**: +$0.025 (+3.17%)
- **7d Change**: +$0.045 (+5.86%)
- **Market Cap**: $8.1B

### Technical Indicators
- **RSI**: 65 (Slightly overbought)
- **MACD**: Bullish momentum
- **Support**: $0.78
- **Resistance**: $0.85

---

## Market Sentiment
- **Overall**: Bullish
- **Volume**: Increasing
- **Volatility**: Moderate

## Recommendations
1. **ETH**: Hold position, consider DCA on dips
2. **MATIC**: Take partial profits at $0.85 resistance
3. **Portfolio**: Maintain current allocation

Would you like detailed analysis of any specific token or trading strategy?`,
  },
  line: {
    content: `# Line Chart Analysis

## ETH/USD Price Chart
Here's a line chart showing ETH price movement over the last 30 days:

\`\`\`chart
{
  "type": "line",
  "data": {
    "categories": ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"],
    "series": [
      {
        "name": "ETH Price",
        "data": [3200, 3250, 3180, 3350, 3420, 3380, 3362]
      }
    ]
  },
  "options": {
    "title": "ETH/USD Price Movement (30 Days)",
    "yAxis": {
      "title": "Price (USD)"
    },
    "xAxis": {
      "title": "Time Period"
    }
  }
}
\`\`\`

## Key Insights
- **Trend**: Overall upward trend with some volatility
- **Support Level**: $3,180
- **Resistance Level**: $3,420
- **Volume**: Consistent trading volume

## Trading Recommendations
- **Entry Point**: Consider buying on dips near $3,180 support
- **Exit Point**: Take profits around $3,420 resistance
- **Stop Loss**: Set at $3,100 to limit downside risk

Would you like me to analyze any other timeframes or add more technical indicators?`,
  },
  candle: {
    content: `# Candlestick Chart Analysis

## BTC/USD 4-Hour Candlestick Chart
Here's a candlestick chart showing Bitcoin's price action:

\`\`\`chart
{
  "type": "candlestick",
  "data": {
    "categories": ["09:00", "13:00", "17:00", "21:00", "01:00", "05:00"],
    "series": [
      {
        "name": "BTC/USD",
        "data": [
          [42000, 42500, 41800, 42200],
          [42200, 42800, 42100, 42600],
          [42600, 43000, 42400, 42800],
          [42800, 43200, 42600, 43000],
          [43000, 43400, 42800, 43200],
          [43200, 43600, 43000, 43400]
        ]
      }
    ]
  },
  "options": {
    "title": "BTC/USD 4-Hour Candlestick Chart",
    "yAxis": {
      "title": "Price (USD)"
    },
    "xAxis": {
      "title": "Time (UTC)"
    }
  }
}
\`\`\`

## Candlestick Patterns
- **Bullish Engulfing**: Strong buying pressure
- **Doji**: Indecision in the market
- **Hammer**: Potential reversal signal

## Technical Analysis
- **Trend**: Bullish with higher highs and higher lows
- **Volume**: Increasing volume on up moves
- **Momentum**: RSI showing overbought conditions

## Trading Strategy
- **Long Position**: Consider entering on pullbacks
- **Target**: $44,000 resistance level
- **Risk Management**: Stop loss at $42,000

Would you like me to add more technical indicators or analyze different timeframes?`,
  },
  default: {
    content: `# Welcome to Limitless AI Assistant

I'm here to help you manage your Web3 wallet and navigate the blockchain ecosystem. Here are some things I can help you with:

## Portfolio Management
- Check your **portfolio balance** and performance
- View **transaction history**
- Analyze **asset allocation**

## Transactions
- **Send** tokens to any address
- **Swap** tokens on DEXs
- **Bridge** assets between networks
- **Stake** tokens for rewards

## Market Analysis
- Get **real-time price data**
- View **technical indicators**
- Receive **market insights**
- Analyze **token performance**

## Security & Settings
- **Backup** your wallet
- **Manage** connected dApps
- **Review** transaction history
- **Configure** gas settings

---

## Quick Actions
Try asking me:
- "Show my portfolio balance"
- "Send 0.1 ETH to [address]"
- "Analyze ETH performance"
- "What's the best time to trade?"

How can I assist you today?`,
  },
};

export const getDummyResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("portfolio") || lowerMessage.includes("balance")) {
    return dummyResponses.portfolio.content;
  }

  if (lowerMessage.includes("send") || lowerMessage.includes("transfer")) {
    return dummyResponses.send.content;
  }

  if (
    lowerMessage.includes("analyze") ||
    lowerMessage.includes("performance") ||
    lowerMessage.includes("price")
  ) {
    return dummyResponses.analyze.content;
  }

  if (lowerMessage.includes("line") || lowerMessage.includes("line chart")) {
    return dummyResponses.line.content;
  }

  if (lowerMessage.includes("candle") || lowerMessage.includes("candlestick")) {
    return dummyResponses.candle.content;
  }

  return dummyResponses.default.content;
};
