import { useRef, forwardRef, useImperativeHandle } from "react";
import { useChatContainer } from "../../hooks/useChatContainer";
import ChatLayout from "./ChatLayout";

export interface ChatContainerRef {
  loadExistingChat: (chatId: string) => void;
  startNewChat: () => void;
}

const ChatContainer = forwardRef<ChatContainerRef>((_props, ref) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use custom hook for all business logic
  const {
    chatState,
    currentMessages,
    showInitialState,
    isThinking,
    isLoadingChatMessages,
    handlePromptSubmit,
    loadExistingChat,
    startNewChat,
  } = useChatContainer(messagesEndRef);

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    loadExistingChat,
    startNewChat,
  }), [loadExistingChat, startNewChat]);

  return (
    <ChatLayout
      chatState={chatState}
      currentMessages={currentMessages}
      showInitialState={showInitialState}
      isThinking={isThinking}
      isLoadingChatMessages={isLoadingChatMessages}
      handlePromptSubmit={handlePromptSubmit}
      showLoadingSpinner={true}
    />
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
