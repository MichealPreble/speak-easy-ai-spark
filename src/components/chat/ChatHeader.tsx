
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Sun, 
  Moon, 
  Trash2, 
  FilePlus, 
  Timer,
  SlidersHorizontal
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
  onShowFilter: () => void;
  isVoiceActive?: boolean;
  onToggleVoice?: (timeLimit?: boolean) => void;
  onSummarize?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onClearChat,
  onShowFilter,
  isVoiceActive,
  onToggleVoice,
  onSummarize,
}) => {
  return (
    <div className="p-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-b border-secondary-light/30 dark:border-secondary-dark/30 flex items-center justify-between">
      <div className="text-lg font-semibold">SpeakEasyAI</div>
      <div className="flex items-center space-x-2">
        {onToggleVoice && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onToggleVoice(true)}
                    aria-label="Practice 1-Minute Speech"
                  >
                    <Timer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Practice 1-Minute Speech</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isVoiceActive ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 rounded-full ${
                      isVoiceActive ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => onToggleVoice(false)}
                    aria-label={isVoiceActive ? "Stop recording" : "Start recording"}
                  >
                    {isVoiceActive ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isVoiceActive ? "Stop recording" : "Start recording"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {onSummarize && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={onSummarize}
                  aria-label="Summarize chat"
                >
                  <FilePlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Summarize chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onClearChat}
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onToggleDarkMode}
                aria-label={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDarkMode ? "Light mode" : "Dark mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onShowFilter}
                aria-label="Filter messages"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter messages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatHeader;
