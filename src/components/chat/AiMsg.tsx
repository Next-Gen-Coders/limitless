/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { CHAT_CONSTANTS } from "../../lib/helper";
import { detectAddresses } from "../../utils/addressDetection";
import AddressTag from "../ui/AddressTag";
import type { DetectedAddress } from "../../utils/addressDetection";
import { CryptoLineChart } from "../ui/CryptoLineChart";
import CryptoCandleChart from "../ui/CryptoCandleChart";
import { linechart } from "../../constants/linechart";
import { candlechart } from "../../constants/candlechart";

// Function to extract chart data from content
const extractChartData = (content: string) => {
  try {
    // Look for line chart data in the content
    const lineChartMatch = content.match(/@linechart\.ts/);
    if (lineChartMatch) {
      return { type: "line", data: linechart.chart };
    }

    // Look for candle chart data in the content
    const candleChartMatch = content.match(/@candlechart\.ts/);
    if (candleChartMatch) {
      return {
        type: "candle",
        data: {
          token0: candlechart.token0,
          token1: candlechart.token1,
          chainId: candlechart.chainId,
          seconds: candlechart.seconds,
          candles: candlechart.candles,
        },
      };
    }

    return null;
  } catch (error) {
    console.error("Error extracting chart data:", error);
    return null;
  }
};

// Function to render content with charts
const renderContentWithCharts = (content: string) => {
  const chartData = extractChartData(content);

  if (chartData) {
    // Remove chart references from the content
    const textContent = content
      .replace(/@linechart\.ts/g, "")
      .replace(/@candlechart\.ts/g, "")
      .trim();

    return (
      <div className="space-y-4">
        {textContent && <MarkdownWithAddresses content={textContent} />}
        {chartData.type === "line" && (
          <CryptoLineChart
            chartData={chartData.data as any}
            title="Token Price Analysis"
            description="Price movement over the selected period"
          />
        )}
        {chartData.type === "candle" && (
          <CryptoCandleChart data={chartData.data as any} />
        )}
      </div>
    );
  }

  return <MarkdownWithAddresses content={content} />;
};

const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText("");
    setIsComplete(false);

    const words = text.split(" ");
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayText((prev) => {
          const newText =
            currentIndex === 0 ? words[0] : prev + " " + words[currentIndex];
          return newText;
        });
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Custom renderer for markdown that handles addresses
const MarkdownWithAddresses = ({ content }: { content: string }) => {
  const components = {
    // Custom text renderer that detects addresses
    text: ({ children, ...props }: any) => {
      if (typeof children !== "string") {
        return <span {...props}>{children}</span>;
      }

      const addresses = detectAddresses(children);

      if (addresses.length === 0) {
        return <span {...props}>{children}</span>;
      }

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      addresses.forEach((address: DetectedAddress, index: number) => {
        // Add text before the address
        if (address.startIndex > lastIndex) {
          parts.push(children.substring(lastIndex, address.startIndex));
        }

        // Add the address tag
        parts.push(
          <AddressTag
            key={`address-${index}`}
            address={address.value}
            className="mx-1"
          />
        );

        lastIndex = address.endIndex;
      });

      // Add remaining text after the last address
      if (lastIndex < children.length) {
        parts.push(children.substring(lastIndex));
      }

      return <span {...props}>{parts}</span>;
    },
    // Handle code blocks that might contain addresses
    code: ({ children, ...props }: any) => {
      if (typeof children !== "string") {
        return (
          <code
            {...props}
            className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
          >
            {children}
          </code>
        );
      }

      const addresses = detectAddresses(children);

      if (addresses.length === 0) {
        return (
          <code
            {...props}
            className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
          >
            {children}
          </code>
        );
      }

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      addresses.forEach((address: DetectedAddress, index: number) => {
        // Add text before the address
        if (address.startIndex > lastIndex) {
          parts.push(children.substring(lastIndex, address.startIndex));
        }

        // Add the address tag
        parts.push(
          <AddressTag
            key={`address-${index}`}
            address={address.value}
            className="mx-1"
          />
        );

        lastIndex = address.endIndex;
      });

      // Add remaining text after the last address
      if (lastIndex < children.length) {
        parts.push(children.substring(lastIndex));
      }

      return (
        <code
          {...props}
          className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
        >
          {parts}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
};

const AiMsg = ({
  content,
  isNewMessage = false,
}: {
  content: string;
  isNewMessage?: boolean;
}) => {
  const { displayText, isComplete } = useTypewriter(
    isNewMessage ? content : "",
    CHAT_CONSTANTS.TYPING_SPEED
  );

  return (
    <div className="w-fit">
      <div className="flex items-center gap-2">
        <div className="rounded-full w-fit">
          <img
            src="/logo.png"
            alt="Limitless AI"
            className="w-10 h-10 rounded-full dark:invert"
          />
        </div>
        <p className="font-medium text-foreground">Limitless</p>
      </div>

      <div className="mt-4 sm:ml-14 prose prose-sm max-w-none">
        {isNewMessage ? (
          <div className="relative">
            {renderContentWithCharts(displayText)}
            {!isComplete && (
              <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
            )}
          </div>
        ) : (
          renderContentWithCharts(content)
        )}
      </div>
    </div>
  );
};

export default AiMsg;
