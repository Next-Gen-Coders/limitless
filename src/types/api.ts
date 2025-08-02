/* eslint-disable @typescript-eslint/no-explicit-any */
// API Response Types
export interface ApiResponseType<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

export interface DataWithPagination<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface UserType {
  uid: string;
  pid: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  skills?: string[];
  experience?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccountCreation {
  pid: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface UseFollowType {
  currentUserId: string;
  targetUserId: string;
}

export interface FollowStatsType {
  followersCount: number;
  followingCount: number;
}

// Post Types
export interface PostType {
  postId: string;
  userId: string;
  projectId?: string;
  content: string;
  mediaUrls?: string[];
  type: "post" | "comment" | "reply";
  parentPostId?: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
}

export interface PostCommentType {
  userId: string;
  projectId: string;
  content: string;
  mediaUrls?: string[];
}

// Project Types
export interface ProjectType {
  projectId: string;
  userId: string;
  title: string;
  description: string;
  longDescription?: string;
  mediaUrls?: string[];
  tags?: string[];
  category: string;
  status: "draft" | "published" | "archived";
  githubUrl?: string;
  liveUrl?: string;
  collaborators?: string[];
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
}

// Request Types (Job/Collaboration Requests)
export interface RequestType {
  requestId: string;
  projectId: string;
  userId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  compensationType: "paid" | "unpaid" | "equity" | "revenue_share";
  compensationAmount?: number;
  duration?: string;
  timeCommitment?: string;
  status: "open" | "closed" | "in_progress" | "completed";
  applicationDeadline?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  project?: ProjectType;
  user?: UserType;
}

// Application Types
export interface ApplicationType {
  applicationId: string;
  requestId: string;
  userId: string;
  coverLetter: string;
  portfolio?: string;
  expectedCompensation?: number;
  availability: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
  user?: UserType;
  request?: RequestType;
}

// Chat Types (aligned with server schema)
export interface ChatType {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageType {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  updatedAt?: string;
}

export interface CreateChatRequest {
  title: string;
  userId: string;
}

export interface CreateMessageRequest {
  content: string;
  chatId: string;
  userId: string;
  role: "user" | "assistant";
}

export interface UpdateChatRequest {
  id: string;
  title: string;
}

export interface UpdateMessageRequest {
  id: string;
  content: string;
}

