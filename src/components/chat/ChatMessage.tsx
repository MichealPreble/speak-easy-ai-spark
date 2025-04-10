
import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { Bot, User, Mic, BarChart2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = memo(({ message, isDarkMode }: ChatMessageProps) => {
  const isUser = message.sender === "user";

  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      aria-label={`${isUser ? "Your" : "AI"} message at ${formatTime(message.timestamp)}`}
    >
      <div
        className={`flex items-start gap-2 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar className="h-8 w-8 border border-secondary-light/30 dark:border-secondary-dark/30 backdrop-blur-sm">
          <AvatarFallback
            className={
              isUser
                ? "bg-secondary/10 text-secondary backdrop-blur-sm"
                : "bg-primary/10 text-primary backdrop-blur-sm"
            }
          >
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <div
            className={`p-3 rounded-lg shadow-glass backdrop-blur-sm border ${
              isUser
                ? "bg-primary/15 text-primary-foreground border-primary/20"
                : message.isFeedback
                ? "bg-amber-50/30 dark:bg-amber-950/30 border-amber-200/30 dark:border-amber-800/30"
                : isDarkMode
                ? "bg-muted/20 border-muted/20"
                : "bg-muted/20 border-muted/20"
            }`}
          >
            <div className="prose dark:prose-invert prose-sm max-w-none">
              {message.isFeedback && (
                <div className="flex items-center gap-2 mb-1 font-medium text-amber-700 dark:text-amber-400">
                  <BarChart2 className="h-4 w-4" aria-hidden="true" />
                  <span>Speech Analysis</span>
                  <span className="sr-only">Speech analysis feedback follows</span>
                </div>
              )}
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
            {message.isVoiceMessage && (
              <div className="mt-1 flex items-center text-xs opacity-70">
                <Mic className="h-3 w-3 mr-1" aria-hidden="true" />
                <span>Voice message</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 mx-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
