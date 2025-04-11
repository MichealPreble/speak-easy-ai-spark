
import { memo, useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatSearch from "./ChatSearch";
import LoadingIndicator from "./LoadingIndicator";
import NoMessages from "./NoMessages";
import RealTimeFeedback from "@/components/speech/RealTimeFeedback";

interface ChatProps {
  selectedScenario?: string | null;
}

const Chat = ({ selectedScenario }: ChatProps) => {
  const {
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    isVoiceActive,
    inputRef,
    scrollAreaRef,
    handleSend,
    handleClearChat,
    toggleVoice,
    summarize,
    showTypingIndicator
  } = useChat({ selectedScenario });
  
  // Track transcript and duration for real-time feedback
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentDuration, setCurrentDuration] = useState(0);
  const [speechFeedback, setSpeechFeedback] = useState<any>(null);
  
  // Update from voice recognition data
  useEffect(() => {
    if (isVoiceActive) {
      const interval = setInterval(() => {
        // Increment duration counter while voice is active
        setCurrentDuration(prev => prev + 0.5);
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      // Reset when voice is stopped
      setCurrentDuration(0);
      setCurrentTranscript("");
      setSpeechFeedback(null);
    }
  }, [isVoiceActive]);
  
  // Listen for input changes to update transcript (simplified approach)
  useEffect(() => {
    if (isVoiceActive && input) {
      setCurrentTranscript(input);
    }
  }, [input, isVoiceActive]);

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] w-full border border-secondary-light/30 dark:border-secondary-dark/30 rounded-lg shadow-glass backdrop-blur-md bg-white/85 dark:bg-black/85">
      {/* Chat Header */}
      <ChatHeader 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode} 
        onClearChat={handleClearChat}
        onToggleVoice={toggleVoice}
        isVoiceActive={isVoiceActive}
        onSummarize={summarize}
      />

      {/* Search Bar */}
      <ChatSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Message List */}
      <ScrollArea className="flex-1 p-4" aria-live="polite" ref={scrollAreaRef}>
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isDarkMode={isDarkMode} 
              />
            ))
          ) : (
            <NoMessages isSearching={searchQuery.trim().length > 0} />
          )}
          
          {(isLoading || showTypingIndicator) && <LoadingIndicator isDarkMode={isDarkMode} />}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput
        ref={inputRef}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
        isVoiceActive={isVoiceActive}
      />
      
      {/* Real-time Feedback */}
      <RealTimeFeedback 
        isActive={isVoiceActive}
        transcript={currentTranscript}
        duration={currentDuration}
        feedback={speechFeedback}
      />
    </div>
  );
};

// Memoize the Chat component to prevent unnecessary re-renders
export default memo(Chat);
