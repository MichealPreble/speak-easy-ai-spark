
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { FormEvent, forwardRef } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isVoiceActive?: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ input, isLoading, isVoiceActive, onInputChange, onSend }, ref) => {
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSend();
    };

    return (
      <div className="p-4 border-t border-secondary-light/30 dark:border-secondary-dark/30 mt-auto backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
          aria-label="Send a message"
        >
          <Input
            ref={ref}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={isVoiceActive ? "Listening..." : "Type your message... (supports markdown)"}
            className={`flex-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-secondary-light/30 dark:border-secondary-dark/30 ${isVoiceActive ? "animate-pulse border-primary" : ""}`}
            disabled={isLoading}
            aria-label="Message input"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="bg-primary/15 hover:bg-primary/30 text-primary border border-primary/20 backdrop-blur-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {isVoiceActive && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            <Mic className="h-3 w-3 inline-block mr-1" /> Listening... Speak now
          </div>
        )}
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
