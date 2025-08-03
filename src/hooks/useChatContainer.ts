import { v4 as uuidv4 } from "uuid";
import { useEffect, useCallback, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { ChatState } from "../enums/chat";
import type { Message } from "../types/api";
import { useCreateMessage, useGetChatMessages } from "./services/useMessage";
import { useCreateChat } from "./services/useChat";
import { useUserId } from "../stores/userStore";
import { getDummyResponse } from "../constants/dummyResponses";

export const useChatContainer = (
  onChatCreated: (newChat: {
    id: string;
    title: string;
    createdAt: string;
    userId: string;
  }) => void,
  messagesEndRef: React.RefObject<HTMLDivElement | null>
) => {
  // Get current user ID
  const userId = useUserId();

  // API hooks
  const createMessageMutation = useCreateMessage();
  const createChatMutation = useCreateChat();

  // State to track API availability
  const [apiAvailable, setApiAvailable] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

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
    setChatMessages,
    clearNewMessageMark,
  } = useChatStore();

  // Load messages for the current chat
  const {
    data: chatMessagesResponse,
    isLoading: isLoadingChatMessages,
    error: chatMessagesError,
  } = useGetChatMessages(currentChatId || "", !!currentChatId && apiAvailable);

  // Debug logging
  console.log("useChatContainer - userId:", userId);
  console.log(
    "useChatContainer - createMessageMutation.isPending:",
    createMessageMutation.isPending
  );
  console.log(
    "useChatContainer - createChatMutation.isPending:",
    createChatMutation.isPending
  );
  console.log("useChatContainer - apiAvailable:", apiAvailable);
  console.log("useChatContainer - currentChatId:", currentChatId);
  console.log(
    "useChatContainer - isLoadingChatMessages:",
    isLoadingChatMessages
  );

  // Computed values
  const currentMessages = currentChatId
    ? chatMessages[currentChatId] || []
    : [];
  const isNewChat = !currentChatId;
  const showInitialState = isNewChat && chatState === ChatState.INITIAL;
  const isThinking =
    pendingChatCreation ||
    pendingMessageResponse ||
    createMessageMutation.isPending ||
    createChatMutation.isPending;

  // Auto-scroll helper
  const autoScrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messagesEndRef]);

  // Load messages from API when chat is selected
  useEffect(() => {
    if (
      currentChatId &&
      chatMessagesResponse?.success &&
      chatMessagesResponse.data
    ) {
      console.log("Loading messages for chat:", currentChatId);
      console.log("Messages from API:", chatMessagesResponse.data);

      // Initialize chat if not already done
      initializeChat(currentChatId);

      // Set messages from API
      setChatMessages(currentChatId, chatMessagesResponse.data);

      // Clear new message marks for loaded messages since they're not new
      chatMessagesResponse.data.forEach((message) => {
        clearNewMessageMark(message.id);
      });

      // Set chat state to chatting if we have messages
      if (chatMessagesResponse.data.length > 0) {
        useChatStore.getState().setChatState(ChatState.CHATTING);
      }
    }
  }, [
    currentChatId,
    chatMessagesResponse,
    initializeChat,
    setChatMessages,
    clearNewMessageMark,
  ]);

  // Simulate API delay for fallback
  const simulateApiDelay = (ms: number = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Fallback function to use dummy responses when API is not available
  const handlePromptSubmitFallback = useCallback(
    async (message: string) => {
      console.log("Using fallback dummy responses - API not available");

      const userMessage: Message = {
        id: `user-${uuidv4()}`,
        content: message,
        role: "user",
        chatId: "",
        userId: userId || "user-1",
        createdAt: new Date().toISOString(),
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
          role: "assistant",
          chatId: newChatId,
          userId: userId || "user-1",
          createdAt: new Date().toISOString(),
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
          userId: userId || "user-1",
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
          role: "assistant",
          chatId: currentChatId,
          userId: userId || "user-1",
          createdAt: new Date().toISOString(),
        };

        addMessageToStore(currentChatId, aiMessage);
        completeMessageResponse();
        autoScrollToBottom();
      }
    },
    [
      userId,
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

  // Handle prompt submit - using real API calls with fallback
  const handlePromptSubmit = useCallback(
    async (message: string) => {
      console.log("handlePromptSubmit called with message:", message);
      console.log("handlePromptSubmit - userId:", userId);
      console.log("handlePromptSubmit - isNewChat:", isNewChat);
      console.log("handlePromptSubmit - currentChatId:", currentChatId);
      console.log("handlePromptSubmit - apiAvailable:", apiAvailable);

      if (!userId) {
        console.error("No user ID available for message creation");
        return;
      }

      // If API is not available, use fallback
      if (!apiAvailable) {
        await handlePromptSubmitFallback(message);
        return;
      }

      if (isNewChat) {
        // Create new chat first
        startChatCreation(message);
        autoScrollToBottom();

        try {
          console.log(
            "Creating new chat with title:",
            `Chat about ${message.substring(0, 30)}...`
          );

          // Create chat via API
          const chatResponse = await createChatMutation.mutateAsync({
            title: `Chat about ${message.substring(0, 30)}...`,
          });

          console.log("Chat creation response:", chatResponse);

          if (chatResponse.success && chatResponse.data) {
            const newChatId = chatResponse.data.id;
            console.log("New chat created with ID:", newChatId);

            // Create message via API (this will also generate AI response)
            console.log("Creating message for chat:", newChatId);
            const messageResponse = await createMessageMutation.mutateAsync({
              content: message,
              chatId: newChatId,
              role: "user",
            });

            console.log("Message creation response:", messageResponse);

            if (messageResponse.success) {
              // Initialize chat and add messages
              initializeChat(newChatId);

              // Add user message to store
              addMessageToStore(newChatId, messageResponse.userMessage);

              // Add AI message to store if present
              if (messageResponse.aiMessage) {
                addMessageToStore(newChatId, messageResponse.aiMessage);
              }

              // Set chat title and complete creation
              setChatTitle(chatResponse.data.title);
              setCurrentChatId(newChatId);
              completeChatCreation(newChatId);

              // Notify parent component
              onChatCreated({
                id: newChatId,
                title: chatResponse.data.title,
                userId: chatResponse.data.userId,
                createdAt: chatResponse.data.createdAt,
              });

              autoScrollToBottom();
            }
          }
        } catch (error) {
          console.error("Error creating chat or message:", error);

          // Set API as unavailable and show error
          setApiAvailable(false);
          setApiError(
            "API server is not available. Using demo mode with dummy responses."
          );

          // Use fallback
          await handlePromptSubmitFallback(message);
        }
      } else if (currentChatId) {
        // Add to existing chat
        startMessageResponse();
        autoScrollToBottom();

        try {
          console.log("Creating message for existing chat:", currentChatId);

          // Create message via API (this will also generate AI response)
          const messageResponse = await createMessageMutation.mutateAsync({
            content: message,
            chatId: currentChatId,
            role: "user",
          });

          console.log("Message creation response:", messageResponse);

          if (messageResponse.success) {
            // Add user message to store
            addMessageToStore(currentChatId, messageResponse.userMessage);

            // Add AI message to store if present
            if (messageResponse.aiMessage) {
              addMessageToStore(currentChatId, messageResponse.aiMessage);
            }

            completeMessageResponse();
            autoScrollToBottom();
          }
        } catch (error) {
          console.error("Error creating message:", error);

          // Set API as unavailable and show error
          setApiAvailable(false);
          setApiError(
            "API server is not available. Using demo mode with dummy responses."
          );

          // Use fallback
          await handlePromptSubmitFallback(message);
        }
      }
    },
    [
      userId,
      isNewChat,
      currentChatId,
      apiAvailable,
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
      createMessageMutation,
      createChatMutation,
      handlePromptSubmitFallback,
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
    isLoadingChatMessages,
    handlePromptSubmit,
    apiAvailable,
    apiError,
  };
};
