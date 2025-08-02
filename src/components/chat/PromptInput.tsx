import { ArrowRight, Paperclip, X } from "lucide-react";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatState } from "../../enums/chat";

interface PromptInputProps {
  onSubmit?: (message: string) => void;
  chatState: ChatState;
  disabled?: boolean;
}

const PromptInput = ({ onSubmit, chatState, disabled }: PromptInputProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedPrompts = [
    "Show my portfolio balance",
    "Send 0.1 ETH to wallet",
    "Analyze token performance",
    "Clear chat history",
  ];

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf"
    );
    const invalidFiles = files.filter(
      (file) =>
        !file.type.startsWith("image/") && file.type !== "application/pdf"
    );
    if (invalidFiles.length > 0) {
      alert("Only images and PDF files are supported.");
    }
    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if ((inputValue.trim() || uploadedFiles.length > 0) && onSubmit) {
      onSubmit(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`sticky bottom-4 z-10 ${
        chatState === ChatState.INITIAL ? "mt-10" : "mt-4"
      }`}
    >
      <form
        className={`border p-4 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-text ${
          chatState === ChatState.THINKING ? "pointer-events-none" : ""
        }`}
        onClick={handleContainerClick}
        onSubmit={handleSubmit}
      >
        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors
                  bg-background border-border text-foreground"
              >
                <span className="truncate max-w-[120px] flex items-center gap-1">
                  {file.name}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile(index);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full"
                  aria-label="Remove file"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your Web3 wallet..."
          className="w-full outline-none border-none resize-none min-h-[40px] max-h-[200px] text-foreground placeholder-muted-foreground bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 overflow-y-auto"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
        />

        <div className="flex gap-2 justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePaperclipClick();
              }}
              className="p-1 opacity-30 hover:opacity-80 transition-all duration-200"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              (!inputValue.trim() && uploadedFiles.length === 0) ||
              chatState === ChatState.THINKING ||
              disabled
            }
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {chatState === ChatState.INITIAL && (
          <motion.div
            initial={{ height: "fit-content", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mt-4 flex gap-2 overflow-x-auto items-center"
          >
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputValue(prompt)}
                className="px-3 py-1.5 rounded-full border border-border max-w-[200px] w-fit truncate hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm"
              >
                {prompt}
              </button>
            ))}
            <button
              onClick={() => setInputValue("")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              clear history...
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptInput;
