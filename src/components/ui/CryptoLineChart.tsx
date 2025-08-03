"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
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

interface ChartPoint {
  timestamp: number;
  value: number;
}

interface ChartData {
  token0: string;
  token1: string;
  chainId: number;
  period: string;
  points: ChartPoint[];
}

interface CryptoLineChartProps {
  chartData: ChartData;
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

// Convert chart data to recharts format
const transformChartData = (points: ChartPoint[]) => {
  const transformed = points
    .map((point) => ({
      date: formatTimestamp(point.timestamp),
      value: Number(point.value), // Ensure value is a number
      timestamp: point.timestamp,
    }))
    .sort((a, b) => a.timestamp - b.timestamp); // Ensure proper ordering

  console.log("Transformed data for chart:", transformed);
  return transformed;
};

const chartConfig = {
  value: {
    label: "Price",
    color: "#3b82f6", // Use a specific blue color instead of CSS variable
  },
} satisfies ChartConfig;

export function CryptoLineChart({
  chartData,
  title = "Token Price Chart",
  description = "Price movement over time",
}: CryptoLineChartProps) {
  const transformedData = transformChartData(chartData.points);

  // Debug logging
  console.log("Original chart data:", chartData.points);
  console.log("Transformed chart data:", transformedData);

  // Calculate trend
  const firstValue = chartData.points[0]?.value || 0;
  const lastValue = chartData.points[chartData.points.length - 1]?.value || 0;
  const trend = lastValue > firstValue ? "up" : "down";
  const percentageChange =
    firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <RechartsLineChart
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
            <Line
              dataKey="value"
              type="monotone"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
              activeDot={{
                r: 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
                fill: "#3b82f6",
              }}
              connectNulls={true}
              isAnimationActive={false}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </RechartsLineChart>
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
      </CardFooter>
    </Card>
  );
}
