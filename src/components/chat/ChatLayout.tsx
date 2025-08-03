import AiMsg from "./AiMsg";
import UserMsg from "./UserMsg";
import PromptInput from "./PromptInput";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import type { Message } from "../../types/api";
import { ChatState } from "../../enums/chat";
import { useChatStore } from "../../store/chatStore";

interface ChatLayoutProps {
  // State from hooks
  chatState: ChatState;
  currentMessages: Message[];
  showInitialState: boolean;
  isThinking: boolean;
  isLoadingChatMessages?: boolean;
  handlePromptSubmit: (message: string) => void;

  // Optional customization
  showLoadingSpinner?: boolean;

  // API status
  apiAvailable?: boolean;
  apiError?: string | null;
}

interface ThinkingMessage {
  id: string;
  role: "assistant";
  content: string;
  isThinking: true;
}

type DisplayMessage = Message | ThinkingMessage;

const ChatLayout = ({
  chatState,
  currentMessages,
  showInitialState,
  isThinking,
  isLoadingChatMessages = false,
  handlePromptSubmit,
  showLoadingSpinner = true,
  apiAvailable = true,
  apiError = null,
}: ChatLayoutProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get new message tracking from chat store
  const newlyCreatedMessageIds = useChatStore(
    (state) => state.newlyCreatedMessageIds
  );
  const clearNewMessageMark = useChatStore(
    (state) => state.clearNewMessageMark
  );

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isThinking]);

  // Create thinking message for better UX
  const thinkingMessage: ThinkingMessage = {
    id: "thinking",
    role: "assistant",
    content: "",
    isThinking: true,
  };

  // Always show thinking state when AI is thinking, regardless of message count
  const displayMessages: DisplayMessage[] = isThinking
    ? [...currentMessages, thinkingMessage]
    : currentMessages;

  return (
    <div className="w-full h-full bg-background flex-1">
      <div
        className={`max-w-3xl lg:max-w-5xl mx-auto min-h-[calc(100vh-64px)] h-full flex flex-col relative px-4 ${
          showInitialState ? "pt-[16%] md:pt-[8%]" : ""
        }`}
      >
        <img
          src="/logo.png"
          alt="Limitless AI"
          className="w-full absolute top-0 left-0 dark:invert opacity-[5%] dark:opacity-[3%] blur-[8px] h-fit max-h-[calc(100vh-64px)] object-cover filter grayscale-100"
        />

        {/* API Status Banner */}
        {!apiAvailable && apiError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-300"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Demo Mode</span>
            </div>
            <p className="text-xs mt-1 text-yellow-600 dark:text-yellow-400">
              {apiError}
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {showInitialState && (
            <motion.div
              initial={{ height: "fit-content", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col gap-4 text-xl sm:text-2xl md:text-3xl font-medium text-center"
            >
              <p className="text-foreground">
                Control your Web3 wallet with AI
              </p>
              <p className="text-foreground">
                Let Limitless do it all for you!
              </p>

              {/* Welcome Message */}
              <motion.div
                className="mt-6 p-4 rounded-xl border border-border/30 bg-muted/20 backdrop-blur-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              >
                <p className="text-sm text-muted-foreground">
                  👋 Welcome! I'm your AI assistant. Ask me anything about your
                  Web3 wallet, from checking balances to executing complex
                  transactions. I'm here to help!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key="chat-messages"
          initial={{ height: "0", opacity: 0 }}
          animate={{ height: showInitialState ? "0" : "100%", opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`${
            showInitialState ? "flex-grow-0" : "flex-grow  scrollbar-hide"
          } scroll-smooth relative pt-4`}
        >
          {!showInitialState && (
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Loading spinner for empty chats */}
              {showLoadingSpinner &&
                isLoadingChatMessages &&
                currentMessages.length === 0 && (
                  <div className="flex-1 flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

              {/* Messages */}
              {displayMessages.map((message) => (
                <div key={message.id}>
                  {message.role === "assistant" ? (
                    <AiMsg
                      content={message.content}
                      isThinking={
                        "isThinking" in message ? message.isThinking : false
                      }
                      isNewMessage={
                        newlyCreatedMessageIds.has(message.id) &&
                        message.id !== "thinking"
                      }
                      onTypewriterComplete={() => {
                        // Clear the new message mark when typewriter completes
                        if (newlyCreatedMessageIds.has(message.id)) {
                          clearNewMessageMark(message.id);
                        }
                      }}
                    />
                  ) : (
                    <UserMsg message={message.content} />
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
          <PromptInput onSubmit={handlePromptSubmit} chatState={chatState} />
        </motion.div>
      </div>
    </div>
  );
};

export default ChatLayout;
