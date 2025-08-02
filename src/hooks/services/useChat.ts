import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../lib/config/axiosClient";
import type { 
  ApiResponseType, 
  ChatType, 
  MessageType, 
  CreateChatRequest, 
  CreateMessageRequest, 
  UpdateChatRequest, 
  UpdateMessageRequest 
} from "../../types/api";

// Chat Hooks
export const useGetAllChats = (userId: string) => {
  return useQuery<ApiResponseType<ChatType[]>>({
    queryKey: ["user-chats", userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/user/users/${userId}/chats`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useGetChatById = (chatId: string) => {
  return useQuery<ApiResponseType<ChatType>>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axiosClient.get(`/user/chats/${chatId}`);
      return response.data;
    },
    enabled: !!chatId,
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponseType<ChatType>, Error, CreateChatRequest>({
    mutationFn: async (chatData) => {
      const response = await axiosClient.post("/user/chats", chatData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch user chats
      queryClient.invalidateQueries({ queryKey: ["user-chats", variables.userId] });
    },
  });
};

export const useUpdateChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponseType<ChatType>, Error, UpdateChatRequest>({
    mutationFn: async ({ id, title }) => {
      const response = await axiosClient.put(`/user/chats/${id}`, { title });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specific chat and user chats
      queryClient.invalidateQueries({ queryKey: ["chat", data.data.id] });
      queryClient.invalidateQueries({ queryKey: ["user-chats", data.data.userId] });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponseType<ChatType>, Error, string>({
    mutationFn: async (chatId) => {
      const response = await axiosClient.delete(`/user/chats/${chatId}`);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate user chats and remove specific chat from cache
      queryClient.invalidateQueries({ queryKey: ["user-chats", data.data.userId] });
      queryClient.removeQueries({ queryKey: ["chat", data.data.id] });
      queryClient.removeQueries({ queryKey: ["chat-messages", data.data.id] });
    },
  });
};

// Message Hooks
export const useGetMessagesByChat = (chatId: string) => {
  return useQuery<ApiResponseType<MessageType[]>>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const response = await axiosClient.get(`/user/chats/${chatId}/messages`);
      return response.data;
    },
    enabled: !!chatId,
  });
};

export const useGetMessageById = (messageId: string) => {
  return useQuery<ApiResponseType<MessageType>>({
    queryKey: ["message", messageId],
    queryFn: async () => {
      const response = await axiosClient.get(`/user/messages/${messageId}`);
      return response.data;
    },
    enabled: !!messageId,
  });
};

export const useGetMessagesByUser = (userId: string) => {
  return useQuery<ApiResponseType<MessageType[]>>({
    queryKey: ["user-messages", userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/user/users/${userId}/messages`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponseType<MessageType>, Error, CreateMessageRequest>({
    mutationFn: async (messageData) => {
      const response = await axiosClient.post("/user/messages", messageData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate chat messages to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["chat-messages", variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ["user-messages", variables.userId] });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponseType<MessageType>, Error, UpdateMessageRequest>({
    mutationFn: async ({ id, content }) => {
      const response = await axiosClient.put(`/user/messages/${id}`, { content });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["message", data.data.id] });
      queryClient.invalidateQueries({ queryKey: ["chat-messages", data.data.chatId] });
      queryClient.invalidateQueries({ queryKey: ["user-messages", data.data.userId] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponseType<MessageType>, Error, string>({
    mutationFn: async (messageId) => {
      const response = await axiosClient.delete(`/user/messages/${messageId}`);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate related queries and remove specific message
      queryClient.invalidateQueries({ queryKey: ["chat-messages", data.data.chatId] });
      queryClient.invalidateQueries({ queryKey: ["user-messages", data.data.userId] });
      queryClient.removeQueries({ queryKey: ["message", data.data.id] });
    },
  });
};