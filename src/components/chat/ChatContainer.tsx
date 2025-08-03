import { useRef } from "react";
import { useChatContainer } from "../../hooks/useChatContainer";
import ChatLayout from "./ChatLayout";

interface ChatContainerProps {
  onChatCreated?: (newChat: {
    id: string;
    title: string;
    createdAt: string;
    userId: string;
  }) => void;
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
    apiAvailable,
    apiError,
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
      apiAvailable={apiAvailable}
      apiError={apiError}
    />
  );
};

export default ChatContainer;
