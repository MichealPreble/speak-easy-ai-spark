
import { useEffect } from "react";
import { useChatState } from "@/hooks/chat/useChatState";
import { useChatActions } from "@/hooks/chat/useChatActions";
import { useChatVoice } from "@/hooks/chat/useChatVoice";
import { useChatUI } from "@/hooks/useChatUI";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAnalytics } from "@/hooks/useAnalytics";

interface UseChatProps {
  selectedScenario?: string | null;
}

export const useChat = ({ selectedScenario }: UseChatProps = {}) => {
  // State management
  const {
    input,
    setInput,
    isLoading,
    setIsLoading,
    messages,
    addMessage,
    clearMessages,
    searchQuery,
    setSearchQuery,
    filteredMessages,
    isDarkMode,
    toggleDarkMode
  } = useChatState();

  // UI management
  const {
    inputRef, 
    scrollAreaRef, 
    scrollToBottom, 
    showTyping,
    showTypingIndicator 
  } = useChatUI(messages);

  // Action handlers
  const {
    generateResponse,
    handleSend,
    summarize,
    handleClearChat
  } = useChatActions({
    setInput,
    setIsLoading,
    addMessage,
    clearMessages,
    showTyping,
    selectedScenario
  });

  // Voice recognition
  const {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS
  } = useChatVoice({
    generateResponse
  });

  // Analytics
  const analytics = useAnalytics();
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onVoiceToggle: toggleVoice,
    onSummarize: summarize
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Track search usage
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      analytics.trackSearchUsed();
    }
  }, [searchQuery, analytics]);

  return {
    // State
    messages,
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    
    // Voice
    isVoiceActive,
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS,
    
    // Refs
    inputRef,
    scrollAreaRef,
    
    // Actions
    handleSend,
    handleClearChat,
    toggleVoice,
    toggleDarkMode,
    summarize,
    
    // UI
    showTypingIndicator
  };
};
