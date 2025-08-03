/* eslint-disable @typescript-eslint/no-explicit-any */
// Utility functions and constants for the Limitless application

// Chat related constants
export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 4000,
  TYPING_SPEED: 10, // milliseconds between words
  THINKING_DELAY: 1000, // milliseconds to show thinking state
  MAX_RETRIES: 3,
} as const;

// UI related constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 200,
  SCROLL_BEHAVIOR: "smooth" as ScrollBehavior,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
} as const;

// Theme related constants
export const THEME_CONSTANTS = {
  LIGHT: "light",
  DARK: "dark",
  STORAGE_KEY: "theme",
} as const;

// API related constants
export const API_CONSTANTS = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TIMEOUT: 10000,
  RETRY_DELAY: 1000,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "theme",
  USER_PREFERENCES: "user_preferences",
  SESSION_ID: "session_id",
} as const;

// Utility functions
export const utils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },

  // Generate unique ID
  generateId: (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  // Format timestamp
  formatTimestamp: (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  },

  // Truncate text
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  // Copy to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Sleep function
  sleep: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array)
      return obj.map((item) => utils.deepClone(item)) as T;
    if (typeof obj === "object") {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = utils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  // Get initials from name
  getInitials: (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },
};

// Error handling utilities
export const errorHandler = {
  // Log error with context
  logError: (error: Error, context?: string): void => {
    console.error(`[${context || "App"}] Error:`, error);
  },

  // Create user-friendly error message
  getUserFriendlyMessage: (error: Error): string => {
    if (error.message.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (error.message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    if (error.message.includes("unauthorized")) {
      return "You are not authorized to perform this action.";
    }
    return "Something went wrong. Please try again.";
  },

  // Retry function with exponential backoff
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await utils.sleep(delay * Math.pow(2, i));
        }
      }
    }

    throw lastError!;
  },
};

// Validation utilities
export const validation = {
  // Validate required fields
  isRequired: (value: any): boolean => {
    return value !== null && value !== undefined && value !== "";
  },

  // Validate minimum length
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  // Validate maximum length
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  // Validate pattern
  matchesPattern: (value: string, pattern: RegExp): boolean => {
    return pattern.test(value);
  },
};

// Export all utilities as default
export default {
  CHAT_CONSTANTS,
  UI_CONSTANTS,
  THEME_CONSTANTS,
  API_CONSTANTS,
  STORAGE_KEYS,
  utils,
  errorHandler,
  validation,
};
