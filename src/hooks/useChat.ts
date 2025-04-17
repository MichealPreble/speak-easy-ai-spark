import { useState, useEffect, useCallback } from "react";
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

interface UseChatProps {
  selectedScenario?: string | null;
}

export const useChat = ({ selectedScenario }: UseChatProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
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
  const { getSimulatedResponse } = useChatResponses({ selectedScenario });

  const {
    isVoiceActive,
    toggleVoice: _toggleVoice,
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS
  } = useVoiceRecognition((transcript, feedback) => {
    if (transcript.trim()) {
      const userMessage = addMessage({
        text: transcript,
        sender: 'user',
      });
      
      generateResponse(transcript, userMessage, feedback);
    }
  });

  const generateResponse = (transcript: string, userMessage: Message, speechFeedback?: SpeechFeedback) => {
    setInput("");
    setIsLoading(true);
    
    showTyping(1500);

    setTimeout(() => {
      const botResponse = getSimulatedResponse(transcript);
      
      addMessage({
        text: botResponse,
        sender: "bot",
        read: false
      });

      if (speechFeedback && (transcript.length > 30 || speechFeedback.duration > 5)) {
        const feedbackText = generateSpeechFeedback(speechFeedback);
        
        addMessage({
          text: feedbackText,
          sender: "bot",
          isFeedback: true,
          read: false
        });
      }
      
      setIsLoading(false);
      
      speak(botResponse);
    }, 1500);
  };

  const toggleVoice = useCallback((timeLimit = false) => {
    _toggleVoice(timeLimit);
  }, [_toggleVoice]);

  const handleSendVoice = (transcript: string, speechFeedback: SpeechFeedback) => {
    if (!transcript.trim()) return;
    
    analytics.trackVoiceMessage();
    
    const userMessage = addMessage({
      text: transcript,
      sender: "user",
      isVoiceMessage: true,
      read: false
    });

    setInput("");
    setIsLoading(true);
    
    showTyping(1500);

    setTimeout(() => {
      const botResponse = getSimulatedResponse(transcript);
      
      addMessage({
        text: botResponse,
        sender: "bot",
        read: false
      });

      if (transcript.length > 30 || speechFeedback.duration > 5) {
        const feedbackText = generateSpeechFeedback(speechFeedback);
        
        addMessage({
          text: feedbackText,
          sender: "bot",
          isFeedback: true,
          read: false
        });
      }
      
      setIsLoading(false);
      
      speak(botResponse);
    }, 1500);
  };

  const handleSend = async (text?: string) => {
    if (!text.trim() || isLoading) return;

    analytics.trackMessageSent();

    const userMessage = addMessage({
      text: text,
      sender: "user",
      read: false
    });
    
    setInput("");
    setIsLoading(true);
    
    showTyping(1500);

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

  const summarize = () => {
    analytics.trackSummarize();
    const userMessage = addMessage({
      text: "summarize",
      sender: "user",
      read: false
    });
    generateResponse("summarize", userMessage);
  };

  const handleToggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    analytics.trackThemeToggle(newTheme);
    toggleDarkMode();
  };

  useKeyboardShortcuts({
    onVoiceToggle: toggleVoice,
    onSummarize: summarize
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = async () => {
    analytics.trackClearChat();
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  };

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
    handleSend,
    handleClearChat,
    toggleVoice,
    summarize,
    showTypingIndicator,
    recordingDuration,
    maxRecordingDuration
  };
};

const someAsyncFunction = async () => {
  // Implementation
};

const someAsyncClearFunction = async () => {
  // Implementation
};
