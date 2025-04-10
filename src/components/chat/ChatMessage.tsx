
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message, isDarkMode }: ChatMessageProps) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start gap-2 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback
            className={
              isUser
                ? "bg-secondary/10 text-secondary"
                : "bg-primary/10 text-primary"
            }
          >
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <div
            className={`p-3 rounded-lg ${
              isUser
                ? "bg-primary text-primary-foreground"
                : isDarkMode
                ? "bg-muted"
                : "bg-muted"
            }`}
          >
            <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
              {message.text}
            </ReactMarkdown>
          </div>
          <div className="text-xs text-muted-foreground mt-1 mx-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
