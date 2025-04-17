
import { useState } from "react";
import { Message } from "@/types/chat";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * Hook for managing chat UI state
 */
export function useChatState() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { messages, setMessages, clearMessages, addMessage } = useMessageStore();
  const { searchQuery, setSearchQuery, filteredMessages } = useMessageSearch(messages);
  const { isDarkMode, toggleDarkMode } = useThemeMode();

  return {
    // Input state
    input,
    setInput,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Message state
    messages,
    setMessages,
    clearMessages,
    addMessage,
    
    // Search state
    searchQuery,
    setSearchQuery,
    filteredMessages,
    
    // Theme state
    isDarkMode,
    toggleDarkMode
  };
}
