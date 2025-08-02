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
    <div className="w-full h-full p-4 bg-background flex-1">
      <div
        className={`max-w-3xl lg:max-w-5xl mx-auto min-h-full h-full flex flex-col ${
          showInitialState ? "pt-[16%] md:pt-[8%]" : "pt-0"
        }`}
      >
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
              : "flex-grow mb-6 overflow-y-auto scrollbar-hide"
          } scroll-smooth relative`}
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
        </motion.div>

        <PromptInput onSubmit={handlePromptSubmit} chatState={chatState} />
      </div>
    </div>
  );
};

export default ChatLayout;
