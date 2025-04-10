
import { Button } from "@/components/ui/button";
import { Bot, Moon, Sun, Trash2, Mic, MicOff, BookOpen } from "lucide-react";

interface ChatHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
  onToggleVoice: () => void;
  isVoiceActive: boolean;
  onSummarize: () => void;
}

const ChatHeader = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  onClearChat, 
  onToggleVoice, 
  isVoiceActive,
  onSummarize
}: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary mr-2" />
        <span className="text-lg font-bold">SpeakEasyAI</span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleVoice}
          aria-label={isVoiceActive ? "Disable voice input" : "Enable voice input"}
          title="Toggle voice input (Ctrl+V)"
        >
          {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSummarize}
          aria-label="Summarize conversation"
          title="Summarize conversation (Ctrl+S)"
        >
          <BookOpen className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearChat}
          aria-label="Clear chat history"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
