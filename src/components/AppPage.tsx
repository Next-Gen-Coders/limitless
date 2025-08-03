import { useRef, useCallback } from "react";
import AppLayout from "./AppLayout";
import ChatContainer, { type ChatContainerRef } from "./chat/ChatContainer";

const AppPage = () => {
  const chatContainerRef = useRef<ChatContainerRef>(null);

  const handleChatSelect = useCallback((chatId: string) => {
    if (chatContainerRef.current?.loadExistingChat) {
      chatContainerRef.current.loadExistingChat(chatId);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    if (chatContainerRef.current?.startNewChat) {
      chatContainerRef.current.startNewChat();
    }
  }, []);

  return (
    <AppLayout onChatSelect={handleChatSelect} onNewChat={handleNewChat}>
      <ChatContainer ref={chatContainerRef} />
    </AppLayout>
  );
};

export default AppPage;
