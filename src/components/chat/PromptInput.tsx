import { Send } from "lucide-react";
import { useState, useRef, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatState } from "../../enums/chat";

interface PromptInputProps {
  onSubmit?: (message: string) => void;
  chatState: ChatState;
  disabled?: boolean;
}

const PromptInput = memo(
  ({ onSubmit, chatState, disabled }: PromptInputProps) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Use refs to prevent re-renders for stable values
    const onSubmitRef = useRef(onSubmit);
    const chatStateRef = useRef(chatState);
    const disabledRef = useRef(disabled);

    // Update refs when props change
    onSubmitRef.current = onSubmit;
    chatStateRef.current = chatState;
    disabledRef.current = disabled;

    // Memoize suggested prompts to prevent re-creation
    const suggestedPrompts = useRef([
      "Show my portfolio balance",
      "Send 0.1 ETH to wallet",
      "Analyze token performance",
      "Clear chat history",
    ]).current;

    const handleContainerClick = useCallback(() => {
      inputRef.current?.focus();
    }, []);

    const handleSubmit = useCallback(() => {
      if (inputValue.trim() && onSubmitRef.current) {
        onSubmitRef.current(inputValue.trim());
        setInputValue("");
      }
    }, [inputValue]);

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      },
      [handleSubmit]
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
      },
      []
    );

    const handleInputFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleInputResize = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "auto";
        target.style.height = Math.min(target.scrollHeight, 120) + "px";
      },
      []
    );

    const handlePromptClick = useCallback((prompt: string) => {
      setInputValue(prompt);
    }, []);

    const handleClearHistory = useCallback(() => {
      setInputValue("");
    }, []);

    const handleFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit();
      },
      [handleSubmit]
    );

    const isSubmitDisabled =
      !inputValue.trim() ||
      chatStateRef.current === ChatState.THINKING ||
      disabledRef.current;

    return (
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-background via-background/65 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Input Container */}
            <motion.div
              className={`relative rounded-2xl border transition-all duration-300 ease-out ${
                isFocused
                  ? "border-primary/50 shadow-lg shadow-primary/10 bg-background/95 backdrop-blur-sm"
                  : "border-border/50 shadow-lg shadow-black/5 bg-background/90 backdrop-blur-sm hover:border-border/70 hover:shadow-xl hover:shadow-black/10"
              } ${
                chatStateRef.current === ChatState.THINKING
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
              whileHover={{ scale: isFocused ? 1 : 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <form
                className="p-4 cursor-text"
                onClick={handleContainerClick}
                onSubmit={handleFormSubmit}
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Ask me anything about your Web3 wallet..."
                  className="w-full outline-none border-none resize-none min-h-[24px] max-h-[120px] text-foreground placeholder-muted-foreground bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 overflow-y-auto text-sm leading-relaxed"
                  rows={1}
                  onInput={handleInputResize}
                />

                <div className="flex items-center justify-end mt-3 pt-3 border-t border-border/30">
                  <motion.button
                    onClick={handleSubmit}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isSubmitDisabled
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
                    }`}
                    disabled={isSubmitDisabled}
                    whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Suggested Prompts */}
            <AnimatePresence>
              {chatStateRef.current === ChatState.INITIAL && (
                <motion.div
                  initial={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-4 flex gap-2 overflow-x-auto items-center pb-2 px-1 overflow-hidden"
                >
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-4 py-2 rounded-full border border-border/50 max-w-[200px] w-fit truncate 
                      hover:bg-accent hover:text-accent-foreground hover:border-border transition-all duration-200 
                      text-sm bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md whitespace-nowrap"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={handleClearHistory}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm px-3 py-2 rounded-full hover:bg-muted/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    clear history...
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }
);

PromptInput.displayName = "PromptInput";

export default PromptInput;
