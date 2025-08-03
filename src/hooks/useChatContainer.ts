import { v4 as uuidv4 } from "uuid";
import { useCallback, useState, useEffect, useMemo } from "react";
import { ChatState } from "../enums/chat";
import type { Message } from "../types/api";
import { useCreateChat } from "./services/useChat";
import { useCreateMessage } from "./services/useMessage";
import { useGetChatMessages } from "./services/useMessage";
import { useUserId } from "../stores/userStore";

// Helper function to generate a short title from user prompt
const generateChatTitle = (prompt: string): string => {
  // Remove extra whitespace and limit to 50 characters
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 50) return cleaned;

  // Try to cut at word boundary near 50 chars
  const words = cleaned.split(" ");
  let title = "";
  for (const word of words) {
    if (title.length + word.length + 1 <= 47) {
      title += (title ? " " : "") + word;
    } else {
      break;
    }
  }

  return title + "...";
};

export const useChatContainer = (
  messagesEndRef?: React.RefObject<HTMLDivElement | null>
) => {
  // Local state management (no persistence)
  const [chatState, setChatState] = useState<ChatState>(ChatState.INITIAL);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // User ID from Zustand store
  const userId = useUserId();

  // API mutations
  const createChat = useCreateChat();
  const createMessage = useCreateMessage();

  // API queries - for loading existing chat messages
  const { data: chatMessagesResponse, isLoading: isLoadingChatMessages } =
    useGetChatMessages(currentChatId || "", !!currentChatId);

  // Extract messages from the API response
  const chatMessages = useMemo(() => {
    const messages = chatMessagesResponse?.data || [];
    console.log("chatMessagesResponse:", chatMessagesResponse);
    console.log("extracted chatMessages:", messages);
    return messages;
  }, [chatMessagesResponse]);

  // Computed values
  const showInitialState =
    currentMessages.length === 0 && chatState === ChatState.INITIAL;

  // Auto-scroll helper
  const autoScrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef?.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messagesEndRef]);

  // Load existing chat function
  const loadExistingChat = useCallback((chatId: string) => {
    console.log("Loading existing chat:", chatId);
    setCurrentChatId(chatId);
    setChatState(ChatState.CHATTING);
    setCurrentMessages([]); // Will be populated by useEffect when chatMessages changes
    setIsThinking(false); // Ensure we're not in thinking state when loading existing chat
  }, []);

  // Start new chat function
  const startNewChat = useCallback(() => {
    setCurrentChatId(null);
    setCurrentMessages([]);
    setChatState(ChatState.INITIAL);
    setIsThinking(false);
  }, []);

  // Effect to update current messages when chatMessages changes
  // Only update from API when we're not in thinking state (to avoid overriding optimistic updates)
  useEffect(() => {
    if (chatMessages && currentChatId && !isThinking) {
      console.log("Updating currentMessages from API:", chatMessages);
      setCurrentMessages(chatMessages);
      autoScrollToBottom();
    }
  }, [chatMessages, currentChatId, isThinking, autoScrollToBottom]);

  // Handle prompt submit - real API integration with chat creation
  const handlePromptSubmit = useCallback(
    async (message: string) => {
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      // Set thinking state immediately
      setChatState(ChatState.THINKING);
      setIsThinking(true);

      try {
        let chatId = currentChatId;

        // Create chat if this is the first message
        if (!chatId) {
          const chatTitle = generateChatTitle(message);
          console.log("Creating new chat with title:", chatTitle);

          const chatResponse = await createChat.mutateAsync({
            title: chatTitle,
          });

          // Extract chat ID from standardized API response
          chatId = chatResponse.data.id;
          setCurrentChatId(chatId);
          console.log("Chat created successfully:", chatResponse);
        }

        // Now create the message with the chat ID
        console.log("Creating message in chat:", chatId);
        const messageResponse = await createMessage.mutateAsync({
          content: message,
          chatId: chatId!, // Non-null assertion since we check above
          role: "user",
        });

        console.log("Message created successfully:", messageResponse);

        // Update local state with the new messages
        const newMessages: Message[] = [messageResponse.userMessage];
        if (messageResponse.aiMessage) {
          newMessages.push(messageResponse.aiMessage);
        }

        setCurrentMessages((prev) => [...prev, ...newMessages]);
        setChatState(ChatState.CHATTING);
        setIsThinking(false);
        autoScrollToBottom();
      } catch (error) {
        console.error("Failed to send message:", error);

        // Show error message only when there's an actual error
        const errorMessage: Message = {
          id: `error-${uuidv4()}`,
          content:
            "Sorry, there was an error processing your message. Please try again.",
          role: "assistant",
          chatId: currentChatId || "temp-chat-id",
          userId: userId || "unknown-user",
          createdAt: new Date().toISOString(),
        };

        setCurrentMessages((prev) => [...prev, errorMessage]);
        setChatState(ChatState.CHATTING);
        setIsThinking(false);
        autoScrollToBottom();
      }
    },
    [userId, currentChatId, createChat, createMessage, autoScrollToBottom]
  );

  return {
    chatState,
    currentMessages,
    showInitialState,
    isThinking,
    isLoadingChatMessages,
    handlePromptSubmit,
    loadExistingChat,
    startNewChat,
    currentChatId,
  };
};
