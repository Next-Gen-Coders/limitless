import { useChatStore } from "../store/chatStore";
import AppLayout from "./AppLayout";
import ChatContainer from "./chat/ChatContainer";

const AppPage = () => {
  // Get chat store actions
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId);
  const resetToInitial = useChatStore((state) => state.resetToInitial);

  const handleChatCreated = (newChat: {
    id: string;
    title: string;
    createdAt: string;
    userId: string;
  }) => {
    console.log("New chat created:", newChat);
  };

  const handleChatSelect = (chatId: string) => {
    console.log("Chat selected:", chatId);
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    console.log("New chat requested");
    setCurrentChatId(null);
    resetToInitial();
  };

  return (
    <AppLayout onChatSelect={handleChatSelect} onNewChat={handleNewChat}>
      <ChatContainer onChatCreated={handleChatCreated} />
    </AppLayout>
  );
};

export default AppPage;
