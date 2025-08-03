import AiMsg from "./AiMsg";
import UserMsg from "./UserMsg";
import PromptInput from "./PromptInput";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import type { Message } from "../../types/chat";
import { ChatState } from "../../enums/chat";

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
}

const ChatLayout = ({
  chatState,
  currentMessages,
  showInitialState,
  isThinking,
  isLoadingChatMessages = false,
  handlePromptSubmit,
  showLoadingSpinner = true,
}: ChatLayoutProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full bg-background flex-1">
      <div
        className={`max-w-3xl lg:max-w-5xl mx-auto min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] h-full flex flex-col relative px-4 ${
          showInitialState ? "pt-[16%] md:pt-[8%]" : ""
        }`}
      >
        <img
          src="/logo.png"
          alt="Limitless AI"
          className="w-full absolute top-0 left-0 dark:invert opacity-[5%] dark:opacity-[1%] blur-[8px] h-fit max-h-[calc(100vh-64px)] object-cover filter grayscale-100"
        />
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
            showInitialState
              ? "flex-grow-0"
              : "flex-grow overflow-y-auto scrollbar-hide"
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
              {currentMessages.map((message) => (
                <div key={message.id}>
                  {message.isAi ? (
                    <AiMsg
                      content={message.content}
                      isNewMessage={message.isNewMessage || false}
                    />
                  ) : (
                    <UserMsg message={message.content} />
                  )}
                </div>
              ))}

              {/* Thinking state */}
              {isThinking && currentMessages.length > 0 && (
                <div className="w-fit">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full w-fit">
                      <img
                        src="/logo.png"
                        alt="Limitless AI"
                        className="w-10 h-10 rounded-full dark:invert"
                      />
                    </div>
                    <p className="font-medium text-foreground">Limitless AI</p>
                  </div>
                  <div className="mt-4 sm:ml-14">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200" />
                      </div>
                      <span className="text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

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
