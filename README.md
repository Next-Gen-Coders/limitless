# Limitless Chat Application

This is a React + TypeScript + Vite application with chat functionality, authentication via Privy, and a comprehensive API integration.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: TanStack Query (React Query) v5
- **Authentication**: Privy Auth
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors

## API Documentation

### Response Structure

All API endpoints follow a consistent response structure:

#### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Success message"
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description",
  "statusCode": 400
}
```

### Chat API

#### Create Chat

- **Endpoint**: `POST /user/chats`
- **Request**:

```json
{
  "title": "Chat title (max 50 chars)"
}
```

- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "chat-uuid",
    "title": "Chat title",
    "userId": "user-uuid",
    "createdAt": "2025-08-03T04:09:56.149Z",
    "updatedAt": "2025-08-03T04:09:56.149Z"
  },
  "message": "Chat created successfully"
}
```

#### Update Chat

- **Endpoint**: `PUT /user/chats/:id`
- **Request**:

```json
{
  "title": "Updated chat title"
}
```

- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "chat-uuid",
    "title": "Updated chat title",
    "userId": "user-uuid",
    "createdAt": "2025-08-03T04:09:56.149Z",
    "updatedAt": "2025-08-03T04:10:30.789Z"
  },
  "message": "Chat updated successfully"
}
```

#### Get User Chats

- **Endpoint**: `GET /user/users/:userId/chats`
- **Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "chat-uuid",
      "title": "Chat title",
      "userId": "user-uuid",
      "createdAt": "2025-08-03T04:09:56.149Z",
      "updatedAt": "2025-08-03T04:09:56.149Z"
    }
  ]
}
```

#### Delete Chat

- **Endpoint**: `DELETE /user/chats/:id`
- **Response**:

```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

### Message API

#### Create Message

- **Endpoint**: `POST /user/messages`
- **Request**:

```json
{
  "content": "User message content",
  "chatId": "chat-uuid",
  "role": "user"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Messages created successfully with AI response",
  "userMessage": {
    "id": "message-uuid",
    "content": "User message content",
    "role": "user",
    "chatId": "chat-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-08-03T04:11:15.234Z"
  },
  "aiMessage": {
    "id": "ai-message-uuid",
    "content": "AI response content",
    "role": "assistant",
    "chatId": "chat-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-08-03T04:11:16.345Z"
  }
}
```

#### Update Message

- **Endpoint**: `PUT /user/messages/:id`
- **Request**:

```json
{
  "content": "Updated message content"
}
```

- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "message-uuid",
    "content": "Updated message content",
    "role": "user",
    "chatId": "chat-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-08-03T04:11:15.234Z",
    "updatedAt": "2025-08-03T04:12:00.567Z"
  },
  "message": "Message updated successfully"
}
```

#### Get Chat Messages

- **Endpoint**: `GET /user/chats/:chatId/messages`
- **Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "message-uuid",
      "content": "Message content",
      "role": "user",
      "chatId": "chat-uuid",
      "userId": "user-uuid",
      "createdAt": "2025-08-03T04:11:15.234Z"
    }
  ]
}
```

#### Delete Message

- **Endpoint**: `DELETE /user/messages/:id`
- **Response**:

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### User API

#### Sync User

- **Endpoint**: `POST /user/sync`
- **Request**:

```json
{
  "privyId": "privy-user-id",
  "email": "user@example.com",
  "walletAddress": "0x...",
  "linkedAccounts": [],
  "createdAt": "2025-08-03T04:09:56.149Z"
}
```

#### Get User

- **Endpoint**: `GET /user/users/:privyId`

### Health API

#### Health Check

- **Endpoint**: `GET /health`
- **Response**:

```json
{
  "status": "limitless",
  "timestamp": "2025-08-03T04:09:56.149Z",
  "uptime": 123456,
  "version": "1.0.0",
  "environment": "development"
}
```

## Authentication

The application uses Privy for authentication. All authenticated API calls automatically include the Bearer token via the `authenticatedApiClient` interceptor.

### Client Configuration

#### Authenticated Client

- Automatically adds Privy access token to requests
- Handles token refresh
- Redirects to login on 401 errors

#### Public Client

- Used for non-authenticated endpoints
- Basic error handling

## Frontend Implementation

### Chat Flow

1. User submits a prompt
2. App creates a new chat (if first message) with a generated title
3. App creates a message with the chat ID and user content
4. Backend processes and returns both user and AI messages
5. UI updates with both messages

### State Management

- TanStack Query for server state
- Local state for UI states (thinking, loading)
- Automatic cache invalidation and updates

### Error Handling

- Comprehensive error handling in API clients
- User-friendly error messages in UI
- Fallback states for failed operations

## Development

### Backend Server

**Important**: This frontend application requires a backend API server running on `http://localhost:3000/` to function with real AI responses. If the backend server is not running, the application will automatically fall back to demo mode with dummy responses.

#### Backend Server Setup

1. **Start the backend server** (separate from this frontend)
2. **Ensure it's running on port 3000** (or update `VITE_API_URL` in your environment)
3. **Verify the server is accessible** by visiting `http://localhost:3000/health`

#### Demo Mode

When the backend server is not available, the application will:
- Show a yellow "Demo Mode" banner
- Use dummy responses for all chat interactions
- Display helpful error messages
- Continue to function for testing UI/UX

### Frontend Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3000/
VITE_PRIVY_APP_ID=your-privy-app-id-here
```
