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
import { SwapConfirmation, SwapStatus } from "../swap";
import { linechart } from "../../constants/linechart";
import { candlechart } from "../../constants/candlechart";
import type { SwapData } from "../../types/api";

// Hook for typewriter effect
const useTypewriter = (text: string, speed: number = 50) => {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!text) {
            setDisplayText("");
            setIsComplete(false);
            return;
        }

        setIsComplete(false);
        setDisplayText("");

        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayText((prev) => prev + text.charAt(index));
                index++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return { displayText, isComplete };
};

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
        const cleanedContent = content
            .replace(/@linechart\.ts/g, "")
            .replace(/@candlechart\.ts/g, "");

        return (
            <div className="space-y-4">
                {cleanedContent.trim() && (
                    <MarkdownRenderer content={cleanedContent.trim()} />
                )}
                {chartData.type === "line" ? (
                    <CryptoLineChart data={chartData.data} />
                ) : (
                    <CryptoCandleChart {...chartData.data} />
                )}
            </div>
        );
    }

    return <MarkdownRenderer content={content} />;
};

// Markdown renderer component
const MarkdownRenderer = ({ content }: { content: string }) => {
    const components = {
        code: ({ children, ...props }: any) => {
            if (!children) return null;

            const addresses = detectAddresses(children.toString());

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

            const parts: (string | React.ReactNode)[] = [];
            let lastIndex = 0;

            addresses.forEach((addr: DetectedAddress, index: number) => {
                if (addr.start > lastIndex) {
                    parts.push(children.substring(lastIndex, addr.start));
                }
                parts.push(
                    <AddressTag
                        key={`${addr.address}-${index}`}
                        address={addr.address}
                        type={addr.type}
                        chainId={addr.chainId}
                    />
                );
                lastIndex = addr.end;
            });

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

interface EnhancedAiMsgProps {
    content: string;
    isNewMessage?: boolean;
    chatId?: string;
    messageId?: string;
    swapData?: SwapData;
    toolsUsed?: string[];
}

type SwapState = 'none' | 'confirmation' | 'executing' | 'status';

const EnhancedAiMsg: React.FC<EnhancedAiMsgProps> = ({
    content,
    isNewMessage = false,
    chatId,
    messageId,
    swapData,
    toolsUsed = [],
}) => {
    const { displayText, isComplete } = useTypewriter(
        isNewMessage ? content : "",
        CHAT_CONSTANTS.TYPING_SPEED
    );

    const [swapState, setSwapState] = useState<SwapState>('none');
    const [currentSwapId, setCurrentSwapId] = useState<string | null>(null);
    const [localSwapData, setLocalSwapData] = useState<SwapData | null>(null);

    // Handle swap data from props or tools
    useEffect(() => {
        const hasSwapTool = toolsUsed.includes('cross_chain_swap');

        if (swapData && hasSwapTool) {
            setLocalSwapData(swapData);
            setSwapState('confirmation');
        } else if (hasSwapTool && isComplete && !swapData) {
            // Tool was used but no swap data provided - might need to extract from content
            console.log('Swap tool used but no swapData provided');
        }
    }, [swapData, toolsUsed, isComplete]);

    const handleSwapInitiated = (swapId: string) => {
        setCurrentSwapId(swapId);
        setSwapState('status');
    };

    const handleCancelSwap = () => {
        setSwapState('none');
        setLocalSwapData(null);
    };

    const handleSwapComplete = () => {
        // Optionally handle swap completion
        console.log('Swap completed successfully');
    };

    const finalContent = isNewMessage ? displayText : content;

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

            <div className="mt-4 sm:ml-14 prose prose-sm max-w-none space-y-4">
                {/* Main content */}
                {isNewMessage ? (
                    <div className="relative">
                        {renderContentWithCharts(finalContent)}
                        {!isComplete && (
                            <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
                        )}
                    </div>
                ) : (
                    renderContentWithCharts(finalContent)
                )}

                {/* Swap confirmation */}
                {swapState === 'confirmation' && localSwapData && (
                    <div className="mt-4">
                        <SwapConfirmation
                            swapData={localSwapData}
                            chatId={chatId}
                            messageId={messageId}
                            onSwapInitiated={handleSwapInitiated}
                            onCancel={handleCancelSwap}
                        />
                    </div>
                )}

                {/* Swap status */}
                {swapState === 'status' && currentSwapId && (
                    <div className="mt-4">
                        <SwapStatus
                            swapId={currentSwapId}
                            onComplete={handleSwapComplete}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedAiMsg;