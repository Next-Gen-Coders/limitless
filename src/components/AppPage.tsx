import AppLayout from "./AppLayout";
import ChatContainer from "./chat/ChatContainer";

const AppPage = () => {
  const handleChatCreated = (newChat: {
    id: string;
    title: string;
    createdAt: string;
    userId: string;
  }) => {
    console.log("New chat created:", newChat);
  };

  return (
    <AppLayout>
      <ChatContainer onChatCreated={handleChatCreated} />
    </AppLayout>
  );
};

export default AppPage;
