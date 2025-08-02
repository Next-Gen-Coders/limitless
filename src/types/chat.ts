export type NewChatType = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
};

export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: string;
  isNewMessage?: boolean;
  responseTime?: number; // Response time in milliseconds
}

export type AddNewMessageType = {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  isAi: boolean;
  createdAt: string;
};
