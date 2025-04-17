
import { useCallback } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useChatFeedback } from "@/hooks/useChatFeedback";
import { useChatResponses } from "@/hooks/useChatResponses";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";

interface UseChatActionsProps {
  setInput: (value: string) => void;
  setIsLoading: (value: boolean) => void;
  addMessage: (message: any) => void;
  clearMessages: () => void;
  showTyping: (duration: number) => void;
  selectedScenario?: string | null;
}

/**
 * Hook for chat action handlers (sending messages, voice, etc.)
 */
export function useChatActions({
  setInput,
  setIsLoading,
  addMessage,
  clearMessages,
  showTyping,
  selectedScenario
}: UseChatActionsProps) {
  const { toast } = useToast();
  const { speak } = useSpeechSynthesis();
  const analytics = useAnalytics();
  const { generateSpeechFeedback } = useChatFeedback();
  const { getSimulatedResponse } = useChatResponses({ selectedScenario });

  const generateResponse = useCallback((transcript: string, speechFeedback?: SpeechFeedback) => {
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
  }, [addMessage, generateSpeechFeedback, getSimulatedResponse, setInput, setIsLoading, showTyping, speak]);

  const handleSend = useCallback(async () => {
    const currentInput = document.querySelector('input[aria-label="Search messages"]')?.value || "";
    if (!currentInput.trim() || setIsLoading) return;

    analytics.trackMessageSent();

    addMessage({
      text: currentInput,
      sender: "user",
      read: false
    });
    
    setInput("");
    setIsLoading(true);
    
    showTyping(1500);

    setTimeout(() => {
      const botResponse = getSimulatedResponse(currentInput);
      
      addMessage({
        text: botResponse,
        sender: "bot",
        read: false
      });
      
      setIsLoading(false);
    }, 1500);
  }, [addMessage, analytics, getSimulatedResponse, setInput, setIsLoading, showTyping]);

  const summarize = useCallback(() => {
    analytics.trackSummarize();
    addMessage({
      text: "summarize",
      sender: "user",
      read: false
    });
    generateResponse("summarize");
  }, [addMessage, analytics, generateResponse]);

  const handleClearChat = useCallback(async () => {
    analytics.trackClearChat();
    await clearMessages();
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  }, [analytics, clearMessages, toast]);

  return {
    generateResponse,
    handleSend,
    summarize,
    handleClearChat
  };
}
