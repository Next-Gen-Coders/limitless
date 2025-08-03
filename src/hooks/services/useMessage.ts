import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authenticatedApiClient from "../../lib/config/authenticatedApiClient";
import type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  CreateMessageResponse,
  UpdateMessageResponse,
  DeleteMessageResponse,
  GetMessageResponse,
  GetChatMessagesResponse,
  GetUserMessagesResponse,
  MessageQueryKeys,
  DeleteMessageContext,
} from "../../types/api";
import { API_ENDPOINTS } from "../../types/api";

// Query Keys
export const messageKeys: MessageQueryKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  listByChat: (chatId: string) =>
    [...messageKeys.lists(), "chat", chatId] as const,
  listByUser: (userId: string) =>
    [...messageKeys.lists(), "user", userId] as const,
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
};

// Hook to get message by ID
export const useGetMessage = (id: string, enabled: boolean = true) => {
  return useQuery<GetMessageResponse>({
    queryKey: messageKeys.detail(id),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.MESSAGE_BY_ID(id)
      );
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes (messages don't change often)
  });
};

// Hook to get all messages in a chat
export const useGetChatMessages = (chatId: string, enabled: boolean = true) => {
  return useQuery<GetChatMessagesResponse>({
    queryKey: messageKeys.listByChat(chatId),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.CHAT_MESSAGES(chatId)
      );
      return response.data;
    },
    enabled: enabled && !!chatId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    // Sort messages by creation date for consistent ordering
    select: (data) => ({
      ...data,
      data:
        data.data?.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ) || [],
    }),
  });
};

// Hook to get all messages by a user
export const useGetUserMessages = (userId: string, enabled: boolean = true) => {
  return useQuery<GetUserMessagesResponse>({
    queryKey: messageKeys.listByUser(userId),
    queryFn: async () => {
      const response = await authenticatedApiClient.get(
        API_ENDPOINTS.USER_MESSAGES(userId)
      );
      return response.data;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create a new message (with automatic AI response for user messages)
export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateMessageResponse, Error, CreateMessageRequest>({
    mutationFn: async (messageData: CreateMessageRequest) => {
      const response = await authenticatedApiClient.post(
        API_ENDPOINTS.MESSAGES,
        messageData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { chatId } = variables;

      // Add the new message(s) to the cache first
      queryClient.setQueryData(
        messageKeys.detail(data.userMessage.id),
        data.userMessage
      );
      if (data.aiMessage) {
        queryClient.setQueryData(
          messageKeys.detail(data.aiMessage.id),
          data.aiMessage
        );
      }

      // Optimistically update the chat messages list
      queryClient.setQueryData(
        messageKeys.listByChat(chatId),
        (oldData: GetChatMessagesResponse | undefined) => {
          // Handle wrapped response format
          const existingMessages = oldData?.data || [];

          const newMessages = [data.userMessage];
          if (data.aiMessage) newMessages.push(data.aiMessage);

          const updatedMessages = [...existingMessages, ...newMessages].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Return in wrapped format
          return {
            success: true,
            message: "Messages updated",
            data: updatedMessages,
          };
        }
      );

      // Invalidate queries AFTER updating cache to avoid race conditions
      // Use a slight delay to prevent interference with optimistic updates
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: messageKeys.listByChat(chatId),
        });

        queryClient.invalidateQueries({
          queryKey: messageKeys.listByUser(data.userMessage.userId),
        });
      }, 100);

      console.log("Message created successfully:", data);
    },
    onError: (error, variables) => {
      console.error("Error creating message:", error);
      console.error("Failed to create message with data:", variables);
    },
  });
};

// Hook to update a message
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateMessageResponse,
    Error,
    { id: string; data: UpdateMessageRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await authenticatedApiClient.put(
        API_ENDPOINTS.MESSAGE_BY_ID(id),
        data
      );
      return response.data;
    },
    onSuccess: (response, { id }) => {
      const updatedMessage = response.data;

      // Update the specific message in cache
      queryClient.setQueryData(messageKeys.detail(id), updatedMessage);

      // Invalidate related queries to refresh lists
      queryClient.invalidateQueries({
        queryKey: messageKeys.listByChat(updatedMessage.chatId),
      });
      queryClient.invalidateQueries({
        queryKey: messageKeys.listByUser(updatedMessage.userId),
      });

      console.log("Message updated successfully:", updatedMessage);
    },
    onError: (error, { id, data }) => {
      console.error("Error updating message:", error);
      console.error("Failed to update message:", id, "with data:", data);
    },
  });
};

// Hook to delete a message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteMessageResponse,
    Error,
    string,
    DeleteMessageContext
  >({
    mutationFn: async (messageId: string) => {
      const response = await authenticatedApiClient.delete(
        API_ENDPOINTS.MESSAGE_BY_ID(messageId)
      );
      return response.data;
    },
    onMutate: async (messageId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: messageKeys.detail(messageId),
      });

      // Get the message to know which chat/user to update
      const previousMessage = queryClient.getQueryData<Message>(
        messageKeys.detail(messageId)
      );

      // Return context with the previous message for rollback
      return { previousMessage };
    },
    onSuccess: (data, messageId, context) => {
      // Remove the message from cache
      queryClient.removeQueries({ queryKey: messageKeys.detail(messageId) });

      // If we have context about the previous message, invalidate related queries
      if (context?.previousMessage) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.listByChat(context.previousMessage.chatId),
        });
        queryClient.invalidateQueries({
          queryKey: messageKeys.listByUser(context.previousMessage.userId),
        });
      } else {
        // Fallback: invalidate all message lists
        queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      }

      console.log("Message deleted successfully:", data);
    },
    onError: (error, messageId, context) => {
      // If we had previous data, restore it
      if (context?.previousMessage) {
        queryClient.setQueryData(
          messageKeys.detail(messageId),
          context.previousMessage
        );
      }

      console.error("Error deleting message:", error);
      console.error("Failed to delete message:", messageId);
    },
  });
};
