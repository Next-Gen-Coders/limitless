import { useRef } from "react";
import type { NewChatType } from "../../types/chat";
import { useChatContainer } from "../../hooks/useChatContainer";
import ChatLayout from "./ChatLayout";

interface ChatContainerProps {
  onChatCreated?: (newChat: NewChatType) => void;
}

const ChatContainer = ({ onChatCreated = () => {} }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use custom hook for all business logic
  const {
    chatState,
    currentMessages,
    showInitialState,
    isThinking,
    isLoadingChatMessages,
    handlePromptSubmit,
  } = useChatContainer(onChatCreated, messagesEndRef);

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
};

export default ChatContainer;
