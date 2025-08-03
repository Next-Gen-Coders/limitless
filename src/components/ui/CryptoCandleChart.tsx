"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleChartData {
  token0: string;
  token1: string;
  chainId: number;
  seconds: number;
  candles: CandleData[];
}

interface CryptoCandleChartProps {
  chartData: CandleChartData;
  title?: string;
  description?: string;
}

// Convert timestamp to readable date
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Calculate EMA (Exponential Moving Average)
const calculateEMA = (data: number[], period: number) => {
  const k = 2 / (period + 1);
  let ema = data[0];
  const emaData = [ema];

  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emaData.push(ema);
  }

  return emaData;
};

// Transform candle data for recharts
const transformCandleData = (candles: CandleData[]) => {
  const closePrices = candles.map((c) => c.close);
  const ema12 = calculateEMA(closePrices, 12);
  const ema26 = calculateEMA(closePrices, 26);

  return candles
    .map((candle, index) => ({
      date: formatTimestamp(candle.timestamp),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      timestamp: candle.timestamp,
      // Calculate if candle is bullish (green) or bearish (red)
      isBullish: candle.close >= candle.open,
      // Calculate body height for candlestick
      bodyHeight: Math.abs(candle.close - candle.open),
      // Calculate wick positions
      wickTop: Math.max(candle.open, candle.close),
      wickBottom: Math.min(candle.open, candle.close),
      // For simpler rendering, use close price as main value
      value: candle.close,
      // Moving averages
      ema12: ema12[index],
      ema26: ema26[index],
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
};

const chartConfig = {
  close: {
    label: "Close Price",
    color: "#3b82f6",
  },
  volume: {
    label: "Volume",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function CryptoCandleChart({
  chartData,
  title = "Token Price Candlestick Chart",
  description = "Price movement with OHLC data",
}: CryptoCandleChartProps) {
  const transformedData = transformCandleData(chartData.candles);

  // Debug logging
  console.log("Candle chart data:", chartData);
  console.log("Transformed candle data:", transformedData);

  // Calculate overall trend
  const firstCandle = chartData.candles[0];
  const lastCandle = chartData.candles[chartData.candles.length - 1];
  const trend = lastCandle.close > firstCandle.open ? "up" : "down";
  const percentageChange =
    firstCandle.open > 0
      ? ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100
      : 0;

  // Calculate total volume
  const totalVolume = chartData.candles.reduce(
    (sum, candle) => sum + candle.volume,
    0
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] relative">
        {/* Information Panel */}
        <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
          <div className="font-medium">
            O: {lastCandle.open.toFixed(4)} H: {lastCandle.high.toFixed(4)} L:{" "}
            {lastCandle.low.toFixed(4)} C: {lastCandle.close.toFixed(4)}
          </div>
          <div className="text-green-500">
            +{(lastCandle.close - lastCandle.open).toFixed(4)} (+
            {(
              ((lastCandle.close - lastCandle.open) / lastCandle.open) *
              100
            ).toFixed(2)}
            %)
          </div>
          <div className="text-blue-500">
            EMA (12) {transformedData[transformedData.length - 1].ema12.toFixed(4)}
          </div>
          <div className="text-red-500">
            EMA (26) {transformedData[transformedData.length - 1].ema26.toFixed(4)}
          </div>
        </div>

        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <ComposedChart
            data={transformedData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => value.toFixed(4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {/* Custom candlestick rendering */}
            {transformedData.map((candle, index) => {
              const x = index * 30 + 15; // Position each candle
              const candleWidth = 8;
              // const bodyHeight = Math.max(candle.bodyHeight * 1000000, 2);
              const isBullish = candle.isBullish;

              // Calculate Y positions (invert for chart coordinates)
              const highY = 250 - candle.high * 1000000;
              const lowY = 250 - candle.low * 1000000;
              const openY = 250 - candle.open * 1000000;
              const closeY = 250 - candle.close * 1000000;
              const bodyTopY = Math.min(openY, closeY);
              const bodyBottomY = Math.max(openY, closeY);

              return (
                <g key={index}>
                  {/* Wick (high to low) */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isBullish ? "#10b981" : "#ef4444"}
                    strokeWidth={1}
                  />

                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTopY}
                    width={candleWidth}
                    height={Math.max(bodyBottomY - bodyTopY, 1)}
                    fill={isBullish ? "#10b981" : "#ef4444"}
                    stroke={isBullish ? "#10b981" : "#ef4444"}
                    strokeWidth={1}
                  />
                </g>
              );
            })}

            {/* Volume bars at the bottom */}
            {transformedData.map((candle, index) => {
              const x = index * 30 + 15;
              const volumeHeight = (candle.volume / 5000) * 50; // Scale volume to fit

              return (
                <rect
                  key={`volume-${index}`}
                  x={x - 4}
                  y={300 - volumeHeight}
                  width={8}
                  height={volumeHeight}
                  fill={candle.isBullish ? "#10b981" : "#ef4444"}
                  opacity={0.6}
                />
              );
            })}

            {/* Moving Average Lines */}
            {transformedData.map((candle, index) => {
              if (index === 0) return null;

              const x1 = (index - 1) * 30 + 15;
              const x2 = index * 30 + 15;
              const y1_12 = 250 - transformedData[index - 1].ema12 * 1000000;
              const y2_12 = 250 - candle.ema12 * 1000000;
              const y1_26 = 250 - transformedData[index - 1].ema26 * 1000000;
              const y2_26 = 250 - candle.ema26 * 1000000;

              return (
                <g key={`ma-${index}`}>
                  {/* EMA 12 */}
                  <line
                    x1={x1}
                    y1={y1_12}
                    x2={x2}
                    y2={y2_12}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  {/* EMA 26 */}
                  <line
                    x1={x1}
                    y1={y1_26}
                    x2={x2}
                    y2={y2_26}
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending {trend} by {Math.abs(percentageChange).toFixed(2)}%
          <TrendingUp
            className={`h-4 w-4 ${trend === "down" ? "rotate-180" : ""}`}
          />
        </div>
        <div className="text-muted-foreground leading-none">
          {chartData.token0} / {chartData.token1} on Chain ID{" "}
          {chartData.chainId}
        </div>
        <div className="text-muted-foreground leading-none">
          Total Volume: {totalVolume.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}
