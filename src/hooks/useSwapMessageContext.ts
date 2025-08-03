import { createContext, useContext, useState, useCallback } from "react";
import type { SwapData } from "../types/api";

interface SwapMessageData {
  messageId: string;
  swapData: SwapData;
  toolsUsed?: string[];
  chartData?: any;
}

interface SwapMessageContextType {
  swapMessages: Map<string, SwapMessageData>;
  addSwapMessage: (
    messageId: string,
    data: Omit<SwapMessageData, "messageId">
  ) => void;
  getSwapMessage: (messageId: string) => SwapMessageData | undefined;
  removeSwapMessage: (messageId: string) => void;
  clearSwapMessages: () => void;
}

const SwapMessageContext = createContext<SwapMessageContextType | undefined>(
  undefined
);

export const useSwapMessageContext = () => {
  const context = useContext(SwapMessageContext);
  if (!context) {
    throw new Error(
      "useSwapMessageContext must be used within SwapMessageProvider"
    );
  }
  return context;
};

// Hook for managing swap message data without React context
export const useSwapMessages = () => {
  const [swapMessages, setSwapMessages] = useState<
    Map<string, SwapMessageData>
  >(new Map());

  const addSwapMessage = useCallback(
    (messageId: string, data: Omit<SwapMessageData, "messageId">) => {
      setSwapMessages(
        (prev) => new Map(prev.set(messageId, { messageId, ...data }))
      );
    },
    []
  );

  const getSwapMessage = useCallback(
    (messageId: string) => {
      return swapMessages.get(messageId);
    },
    [swapMessages]
  );

  const removeSwapMessage = useCallback((messageId: string) => {
    setSwapMessages((prev) => {
      const newMap = new Map(prev);
      newMap.delete(messageId);
      return newMap;
    });
  }, []);

  const clearSwapMessages = useCallback(() => {
    setSwapMessages(new Map());
  }, []);

  return {
    swapMessages,
    addSwapMessage,
    getSwapMessage,
    removeSwapMessage,
    clearSwapMessages,
  };
};
