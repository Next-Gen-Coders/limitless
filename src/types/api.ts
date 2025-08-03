// Generic API Response wrapper
export interface ApiResponseType<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Generic API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode?: number;
}

// Generic Success Response
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// =============================================================================
// HEALTH API TYPES
// =============================================================================

export interface HealthService {
  status: "limitless" | "down";
  responseTime?: number;
}

export interface SimpleHealthResponse {
  status: string;
  timestamp?: string;
  method?: string;
  path?: string;
}

export interface HealthCheckResponse {
  status: "limitless" | "healthy" | "unhealthy" | "degraded";
  timestamp?: string;
  services?: Record<string, HealthService>;
  uptime?: number;
  version?: string;
  environment?: string;
}

export interface ServiceHealthResponse {
  status: string;
  responseTime?: number;
}

// =============================================================================
// USER API TYPES
// =============================================================================

export interface User {
  id: string;
  privyId: string;
  email?: string;
  walletAddress?: string;
  linkedAccounts?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSyncRequest {
  privyId: string;
  email?: string;
  walletAddress?: string;
  linkedAccounts: unknown[];
  createdAt: Date;
}

export interface UserSyncResponse {
  success: boolean;
  user: {
    id: string;
    privy_id: string;
    email?: string;
    wallet_address?: string;
    linked_accounts?: unknown[];
    created_at: string;
    updated_at: string;
  };
  message: string;
}

export interface GetUserResponse {
  id: string;
  privyId: string;
  email?: string;
  walletAddress?: string;
  linkedAccounts?: unknown[];
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// CHAT API TYPES
// =============================================================================

export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  title: string;
}

export interface UpdateChatRequest {
  title: string;
}

export interface CreateChatResponse {
  success: boolean;
  data: Chat;
  message: string;
}

export interface UpdateChatResponse {
  success: boolean;
  data: Chat;
  message: string;
}

export interface DeleteChatResponse {
  success: boolean;
  message: string;
}

export interface GetUserChatsResponse {
  success: boolean;
  message: string;
  data: Chat[];
}

// Type aliases for response types (more semantic than extending empty interfaces)
export type GetChatResponse = Chat;

// =============================================================================
// MESSAGE API TYPES
// =============================================================================

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  chatId: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMessageRequest {
  content: string;
  chatId: string;
  role: "user" | "assistant";
}

export interface UpdateMessageRequest {
  content: string;
}

export interface CreateMessageResponse {
  success: boolean;
  message: string;
  userMessage: Message;
  aiMessage?: Message; // Only present when role is "user"
}

export interface UpdateMessageResponse {
  success: boolean;
  data: Message;
  message: string;
}

export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}

// Type aliases for response types (more semantic than extending empty interfaces)
export type GetMessageResponse = Message;
export interface GetChatMessagesResponse {
  success: boolean;
  message: string;
  data: Message[];
}
export interface GetUserMessagesResponse {
  success: boolean;
  message: string;
  data: Message[];
}

// =============================================================================
// QUERY KEY TYPES
// =============================================================================

export interface ChatQueryKeys {
  all: readonly ["chats"];
  lists: () => readonly ["chats", "list"];
  list: (userId: string) => readonly ["chats", "list", string];
  details: () => readonly ["chats", "detail"];
  detail: (id: string) => readonly ["chats", "detail", string];
}

export interface MessageQueryKeys {
  all: readonly ["messages"];
  lists: () => readonly ["messages", "list"];
  listByChat: (chatId: string) => readonly ["messages", "list", "chat", string];
  listByUser: (userId: string) => readonly ["messages", "list", "user", string];
  details: () => readonly ["messages", "detail"];
  detail: (id: string) => readonly ["messages", "detail", string];
}

// =============================================================================
// MUTATION CONTEXT TYPES
// =============================================================================

export interface DeleteMessageContext {
  previousMessage?: Message;
}

export interface DeleteChatContext {
  previousChat?: Chat;
}

// =============================================================================
// API ENDPOINT PATHS
// =============================================================================

export const API_ENDPOINTS = {
  // Health
  HEALTH: "/health",
  SERVICE_HEALTH: (serviceName: string) => `/health/${serviceName}`,

  // User
  USER_SYNC: "/user/sync",
  GET_USER: (privyId: string) => `/user/users/${privyId}`,

  // Chat
  CHATS: "/user/chats",
  CHAT_BY_ID: (id: string) => `/user/chats/${id}`,
  USER_CHATS: (userId: string) => `/user/users/${userId}/chats`,

  // Messages
  MESSAGES: "/user/messages",
  MESSAGE_BY_ID: (id: string) => `/user/messages/${id}`,
  CHAT_MESSAGES: (chatId: string) => `/user/chats/${chatId}/messages`,
  USER_MESSAGES: (userId: string) => `/user/users/${userId}/messages`,
} as const;
