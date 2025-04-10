
import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition, SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import { useChatUI } from "@/hooks/useChatUI";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useChatFeedback } from "@/hooks/useChatFeedback";
import { useChatResponses } from "@/hooks/useChatResponses";

export const useChat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use our specialized hooks
  const { messages, setMessages, clearMessages, addMessage } = useMessageStore();
  const { searchQuery, setSearchQuery, filteredMessages } = useMessageSearch(messages);
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const { speak } = useSpeechSynthesis();
  const { 
    inputRef, 
    scrollAreaRef, 
    scrollToBottom, 
    showTyping,
    showTypingIndicator 
  } = useChatUI(messages);
  const analytics = useAnalytics();
  const { generateSpeechFeedback } = useChatFeedback();
  const { getSimulatedResponse } = useChatResponses();

  // Handle voice message send
  const handleSendVoice = (transcript: string, speechFeedback: SpeechFeedback) => {
    if (!transcript.trim()) return;
    
    // Track voice message event
    analytics.trackVoiceMessage();
    
    const userMessage: Message = {
      id: Date.now(),
      text: transcript,
      sender: "user",
      timestamp: new Date(),
      isVoiceMessage: true,
      read: false
    };
    
    addMessage({
      text: transcript,
      sender: "user",
      isVoiceMessage: true,
      read: false
    });

    setInput("");
    setIsLoading(true);
    
    // Show typing indicator before AI responds
    showTyping(1500);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botResponse = getSimulatedResponse(transcript);
      
      addMessage({
        text: botResponse,
        sender: "bot",
        read: false
      });

      // Only add feedback for longer messages that are actually speech practice
      if (transcript.length > 30 || speechFeedback.duration > 5) {
        const feedbackText = generateSpeechFeedback(speechFeedback, transcript);
        
        addMessage({
          text: feedbackText,
          sender: "bot",
          isFeedback: true,
          read: false
        });
      }
      
      setIsLoading(false);
      
      // Speak the response
      speak(botResponse);
    }, 1500);
  };

  // Handle text message send
  const handleSendMessage = (text = input) => {
    if (!text.trim() || isLoading) return;

    // Track text message event
    analytics.trackMessageSent();

    // Add user message
    addMessage({
      text: text,
      sender: "user",
      read: false
    });
    
    setInput("");
    setIsLoading(true);
    
    // Show typing indicator before AI responds
    showTyping(1500);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botResponse = getSimulatedResponse(text);
      
      addMessage({
        text: botResponse,
        sender: "bot",
        read: false
      });
      
      setIsLoading(false);
    }, 1500);
  };

  // Set up voice recognition
  const { isVoiceActive, toggleVoice, isBrowserSupported } = useVoiceRecognition(handleSendVoice);

  // Summarize the conversation
  const summarize = () => {
    analytics.trackSummarize();
    handleSendMessage("summarize");
  };

  // Handle theme toggling with analytics
  const handleToggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    analytics.trackThemeToggle(newTheme);
    toggleDarkMode();
  };

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onVoiceToggle: toggleVoice,
    onSummarize: summarize
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = () => {
    analytics.trackClearChat();
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  };

  // Track search usage
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      analytics.trackSearchUsed();
    }
  }, [searchQuery]);

  return {
    messages,
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode: handleToggleDarkMode,
    isVoiceActive,
    isBrowserSupported,
    inputRef,
    scrollAreaRef,
    handleSend: handleSendMessage,
    handleClearChat,
    toggleVoice,
    summarize,
    showTypingIndicator
  };
};
