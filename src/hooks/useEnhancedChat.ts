import { useCallback, useState, useEffect } from "react";
import { useCreateMessage } from "./services/useMessage";
import { useSwapMessages } from "./useSwapMessageContext";
import type { Message, MessageWithSwapData } from "../types/api";

// Extended response type that matches your API response
interface EnhancedMessageResponse {
  success: boolean;
  message: string;
  userMessage: Message;
  aiMessage: Message;
  toolsUsed?: string[];
  chartData?: any;
  swapData?: any;
}

export const useEnhancedChat = () => {
  const createMessage = useCreateMessage();
  const { addSwapMessage, getSwapMessage, clearSwapMessages } =
    useSwapMessages();
  const [pendingSwapData, setPendingSwapData] = useState<Map<string, any>>(
    new Map()
  );

  // Enhanced message creation that handles swapData
  const createEnhancedMessage = useCallback(
    async (
      content: string,
      chatId: string,
      role: "user" | "assistant" = "user"
    ): Promise<EnhancedMessageResponse | null> => {
      try {
        const response = await createMessage.mutateAsync({
          content,
          chatId,
          role,
        });

        // If this is a standard response, return it as-is
        if (!response.data) {
          return null;
        }

        // Check if the response includes enhanced data (swapData, toolsUsed, etc.)
        const enhancedResponse = response as any;

        // Handle the enhanced response structure from your example
        if (enhancedResponse.swapData || enhancedResponse.toolsUsed) {
          const aiMessageId = enhancedResponse.aiMessage?.id;

          if (aiMessageId && enhancedResponse.swapData) {
            // Store swap data for the AI message
            addSwapMessage(aiMessageId, {
              swapData: enhancedResponse.swapData,
              toolsUsed: enhancedResponse.toolsUsed || [],
              chartData: enhancedResponse.chartData,
            });
          }

          return {
            success: true,
            message: enhancedResponse.message || "Message created successfully",
            userMessage: enhancedResponse.userMessage,
            aiMessage: enhancedResponse.aiMessage,
            toolsUsed: enhancedResponse.toolsUsed,
            chartData: enhancedResponse.chartData,
            swapData: enhancedResponse.swapData,
          };
        }

        // Return standard response
        return {
          success: true,
          message: "Message created successfully",
          userMessage: response.data as Message,
          aiMessage: response.data as Message,
        };
      } catch (error) {
        console.error("Failed to create enhanced message:", error);
        return null;
      }
    },
    [createMessage, addSwapMessage]
  );

  // Get enhanced message data for a specific message ID
  const getEnhancedMessageData = useCallback(
    (messageId: string) => {
      return getSwapMessage(messageId);
    },
    [getSwapMessage]
  );

  // Clear all enhanced message data (useful when starting new chat)
  const clearEnhancedData = useCallback(() => {
    clearSwapMessages();
    setPendingSwapData(new Map());
  }, [clearSwapMessages]);

  return {
    createEnhancedMessage,
    getEnhancedMessageData,
    clearEnhancedData,
    isLoading: createMessage.isPending,
    error: createMessage.error,
  };
};
