import { create } from "zustand";
import type { Message, Chat } from "../types/api";
import { ChatState } from "../enums/chat";

interface ChatStore {
  // Chat state management
  chatState: ChatState;
  currentChatId: string | null;
  chatMessages: Record<string, Message[]>; // chatId -> messages array
  chatTitle: string | null;

  // Loading states
  pendingChatCreation: boolean;
  pendingMessageResponse: boolean;
  pendingUserMessage: string | null;
  newlyCreatedChatIds: Set<string>;

  // Actions
  setChatState: (state: ChatState) => void;
  setCurrentChatId: (id: string | null) => void;
  setChatTitle: (title: string) => void;
  addMessageToChat: (chatId: string, message: Message) => void;
  setChatMessages: (chatId: string, messages: Message[]) => void;
  initializeChat: (chatId: string) => void;
  clearCurrentChat: () => void;

  // Chat state actions
  startChatCreation: (message: string) => void;
  completeChatCreation: (chatId: string) => void;
  startMessageResponse: () => void;
  completeMessageResponse: () => void;
  resetToInitial: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  chatState: ChatState.INITIAL,
  currentChatId: null,
  chatMessages: {},
  chatTitle: null,
  pendingChatCreation: false,
  pendingMessageResponse: false,
  pendingUserMessage: null,
  newlyCreatedChatIds: new Set(),

  // Basic setters
  setChatState: (state: ChatState) => set({ chatState: state }),
  setChatTitle: (title: string) => set({ chatTitle: title }),
  setCurrentChatId: (id) => set({ currentChatId: id }),

  // Message management
  addMessageToChat: (chatId, message) => {
    const { chatMessages } = get();
    set({
      chatMessages: {
        ...chatMessages,
        [chatId]: [...(chatMessages[chatId] || []), message],
      },
    });
  },

  setChatMessages: (chatId, messages) => {
    const { chatMessages } = get();
    set({
      chatMessages: {
        ...chatMessages,
        [chatId]: messages,
      },
    });
  },

  initializeChat: (chatId) => {
    const { chatMessages } = get();
    if (!chatMessages[chatId]) {
      set({
        chatMessages: {
          ...chatMessages,
          [chatId]: [],
        },
      });
    }
  },

  clearCurrentChat: () => set({ currentChatId: null }),

  // Chat state management actions
  startChatCreation: (message: string) =>
    set({
      chatState: ChatState.THINKING,
      pendingChatCreation: true,
      pendingUserMessage: message,
    }),

  completeChatCreation: (chatId: string) => {
    const { newlyCreatedChatIds } = get();
    set({
      chatState: ChatState.CHATTING,
      pendingChatCreation: false,
      pendingUserMessage: null,
      newlyCreatedChatIds: new Set([...newlyCreatedChatIds, chatId]),
    });
  },

  startMessageResponse: () =>
    set({
      chatState: ChatState.THINKING,
      pendingMessageResponse: true,
    }),

  completeMessageResponse: () =>
    set({
      chatState: ChatState.CHATTING,
      pendingMessageResponse: false,
    }),

  resetToInitial: () => {
    const { newlyCreatedChatIds } = get();
    set({
      chatState: ChatState.INITIAL,
      pendingChatCreation: false,
      pendingMessageResponse: false,
      pendingUserMessage: null,
      newlyCreatedChatIds,
    });
  },
}));
