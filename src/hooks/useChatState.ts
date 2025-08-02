import { useChatStore } from "../store/chatStore";
import { ChatState } from "../enums/chat";

export const useChatState = () => {
  const {
    chatState,
    pendingChatCreation,
    pendingMessageResponse,
    setChatState,
    startChatCreation,
    completeChatCreation,
    startMessageResponse,
    completeMessageResponse,
    resetToInitial,
  } = useChatStore();

  return {
    // Current state
    chatState,
    isInitial: chatState === ChatState.INITIAL,
    isThinking: chatState === ChatState.THINKING,
    isChatting: chatState === ChatState.CHATTING,

    // Loading states
    pendingChatCreation,
    pendingMessageResponse,

    // Actions
    setChatState,
    startChatCreation,
    completeChatCreation,
    startMessageResponse,
    completeMessageResponse,
    resetToInitial,
  };
};
