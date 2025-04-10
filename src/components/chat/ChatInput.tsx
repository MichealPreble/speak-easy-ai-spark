
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FormEvent, forwardRef } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ input, isLoading, onInputChange, onSend }, ref) => {
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSend();
    };

    return (
      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
          aria-label="Send a message"
        >
          <Input
            ref={ref}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message... (supports markdown)"
            className="flex-1"
            disabled={isLoading}
            aria-label="Message input"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
