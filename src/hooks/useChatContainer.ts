import { v4 as uuidv4 } from "uuid";
import { useEffect, useCallback } from "react";
import { useChatStore } from "../store/chatStore";
import { ChatState } from "../enums/chat";
import type { Message, NewChatType } from "../types/chat";
import { getDummyResponse } from "../constants/dummyResponses";

export const useChatContainer = (
  onChatCreated: (newChat: NewChatType) => void,
  messagesEndRef: React.RefObject<HTMLDivElement | null>
) => {
  // Chat store
  const {
    chatState,
    currentChatId,
    chatMessages,
    pendingChatCreation,
    pendingMessageResponse,
    addMessageToChat: addMessageToStore,
    setCurrentChatId,
    setChatTitle,
    initializeChat,
    startChatCreation,
    completeChatCreation,
    startMessageResponse,
    completeMessageResponse,
    resetToInitial,
  } = useChatStore();

  // Computed values
  const currentMessages = currentChatId
    ? chatMessages[currentChatId] || []
    : [];
  const isNewChat = !currentChatId;
  const showInitialState = isNewChat && chatState === ChatState.INITIAL;
  const isThinking = pendingChatCreation || pendingMessageResponse;

  // Auto-scroll helper
  const autoScrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messagesEndRef]);

  // Simulate API delay
  const simulateApiDelay = (ms: number = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Handle prompt submit - simplified flow with dummy responses
  const handlePromptSubmit = useCallback(
    async (message: string) => {
      const userMessage: Message = {
        id: `user-${uuidv4()}`,
        content: message,
        isAi: false,
        timestamp: new Date().toISOString(),
      };

      if (isNewChat) {
        // Create new chat
        startChatCreation(message);
        autoScrollToBottom();

        // Simulate API delay
        await simulateApiDelay(2000);

        const newChatId = `chat-${uuidv4()}`;
        const aiResponse = getDummyResponse(message);
        const aiMessage: Message = {
          id: `ai-${uuidv4()}`,
          content: aiResponse,
          isAi: true,
          timestamp: new Date().toISOString(),
          isNewMessage: true,
          responseTime: 2000,
        };

        // Initialize chat and add messages
        initializeChat(newChatId);
        addMessageToStore(newChatId, userMessage);
        addMessageToStore(newChatId, aiMessage);

        // Set chat title and complete creation
        setChatTitle(`Chat about ${message.substring(0, 30)}...`);
        setCurrentChatId(newChatId);
        completeChatCreation(newChatId);

        // Notify parent component
        onChatCreated({
          id: newChatId,
          title: `Chat about ${message.substring(0, 30)}...`,
          userId: "user-1", // Dummy user ID
          createdAt: new Date().toISOString(),
        });

        autoScrollToBottom();
      } else if (currentChatId) {
        // Add to existing chat
        addMessageToStore(currentChatId, userMessage);
        startMessageResponse();
        autoScrollToBottom();

        // Simulate AI response
        await simulateApiDelay(1500);

        const aiResponse = getDummyResponse(message);
        const aiMessage: Message = {
          id: `ai-${uuidv4()}`,
          content: aiResponse,
          isAi: true,
          timestamp: new Date().toISOString(),
          isNewMessage: true,
          responseTime: 1500,
        };

        addMessageToStore(currentChatId, aiMessage);
        completeMessageResponse();
        autoScrollToBottom();
      }
    },
    [
      isNewChat,
      currentChatId,
      addMessageToStore,
      initializeChat,
      setCurrentChatId,
      setChatTitle,
      onChatCreated,
      autoScrollToBottom,
      startChatCreation,
      completeChatCreation,
      startMessageResponse,
      completeMessageResponse,
    ]
  );

  // Handle chat state changes when switching chats
  useEffect(() => {
    if (isNewChat) {
      resetToInitial();
    } else if (currentChatId) {
      if (currentMessages.length > 0) {
        // Chat already has messages, set to chatting state
        useChatStore.getState().setChatState(ChatState.CHATTING);
      } else {
        initializeChat(currentChatId);
      }
    }
  }, [
    currentChatId,
    isNewChat,
    currentMessages.length,
    initializeChat,
    resetToInitial,
  ]);

  return {
    chatState,
    currentMessages,
    showInitialState,
    isThinking,
    isLoadingChatMessages: false,
    handlePromptSubmit,
  };
};
