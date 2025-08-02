/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { CHAT_CONSTANTS } from "../../lib/helper";

const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText("");
    setIsComplete(false);

    const words = text.split(" ");
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayText((prev) => {
          const newText =
            currentIndex === 0 ? words[0] : prev + " " + words[currentIndex];
          return newText;
        });
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

const AiMsg = ({
  content,
  isNewMessage = false,
}: {
  content: string;
  isNewMessage?: boolean;
}) => {
  const { displayText, isComplete } = useTypewriter(
    isNewMessage ? content : "",
    CHAT_CONSTANTS.TYPING_SPEED
  );

  return (
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

      <div className="mt-4 sm:ml-14 prose prose-sm max-w-none">
        {isNewMessage ? (
          <div className="relative">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayText}
            </ReactMarkdown>
            {!isComplete && (
              <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
            )}
          </div>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default AiMsg;
