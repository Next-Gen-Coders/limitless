import AppLayout from "./AppLayout";
import ChatContainer from "./chat/ChatContainer";
import type { NewChatType } from "../types/chat";

const AppPage = () => {
  const handleChatCreated = (newChat: NewChatType) => {
    console.log("New chat created:", newChat);
  };

  return (
    <AppLayout>
      <ChatContainer onChatCreated={handleChatCreated} />
    </AppLayout>
  );
};

export default AppPage;
