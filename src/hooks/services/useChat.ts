import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authenticatedApiClient from "../../lib/config/authenticatedApiClient";
import type {
  CreateChatRequest,
  UpdateChatRequest,
  CreateChatResponse,
  UpdateChatResponse,
  DeleteChatResponse,
  GetChatResponse,
  GetUserChatsResponse,
  ChatQueryKeys,
} from "../../types/api";
import { API_ENDPOINTS } from "../../types/api";

// Query Keys
export const chatKeys: ChatQueryKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (userId: string) => [...chatKeys.lists(), userId] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
};

// Hook to get chat by ID
export const useGetChat = (id: string, enabled: boolean = true) => {
  return useQuery<GetChatResponse>({
    queryKey: chatKeys.detail(id),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.CHAT_BY_ID(id)
      );
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get all chats for a user
export const useGetUserChats = (userId: string, enabled: boolean = true) => {
  return useQuery<GetUserChatsResponse>({
    queryKey: chatKeys.list(userId),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.USER_CHATS(userId)
      );
      return response.data;
    },
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create a new chat
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateChatResponse, Error, CreateChatRequest>({
    mutationFn: async (chatData: CreateChatRequest) => {
      const response = await authenticatedApiClient.post(
        API_ENDPOINTS.CHATS,
        chatData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user chats list
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

      // Add the new chat to the cache
      if (data.data) {
        queryClient.setQueryData(chatKeys.detail(data.data.id), data.data);
      }

      console.log("Chat created successfully:", data);
    },
    onError: (error, variables) => {
      console.error("Error creating chat:", error);
      console.error("Failed to create chat with data:", variables);
    },
  });
};

// Hook to update a chat
export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateChatResponse,
    Error,
    { id: string; data: UpdateChatRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authenticatedApiClient.put(
        API_ENDPOINTS.CHAT_BY_ID(id),
        data
      );
      return response.data;
    },
    onSuccess: (response, { id }) => {
      const updatedChat = response.data;

      // Update the specific chat in cache
      queryClient.setQueryData(chatKeys.detail(id), updatedChat);

      // Invalidate user chats list to refresh the list view
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

      console.log("Chat updated successfully:", updatedChat);
    },
    onError: (error, { id, data }) => {
      console.error("Error updating chat:", error);
      console.error("Failed to update chat:", id, "with data:", data);
    },
  });
};

// Hook to delete a chat
export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteChatResponse, Error, string>({
    mutationFn: async (chatId: string) => {
      const response = await authenticatedApiClient.delete(
        API_ENDPOINTS.CHAT_BY_ID(chatId)
      );
      return response.data;
    },
    onSuccess: (data, chatId) => {
      // Remove the chat from cache
      queryClient.removeQueries({ queryKey: chatKeys.detail(chatId) });

      // Invalidate user chats list
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

      // Also invalidate any related message queries
      queryClient.invalidateQueries({ queryKey: ["messages", "chat", chatId] });

      console.log("Chat deleted successfully:", data);
    },
    onError: (error, chatId) => {
      console.error("Error deleting chat:", error);
      console.error("Failed to delete chat:", chatId);
    },
  });
};
