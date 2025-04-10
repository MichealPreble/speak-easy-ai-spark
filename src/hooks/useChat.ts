
import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import { useChatUI } from "@/hooks/useChatUI";

export const useChat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use our specialized hooks
  const { messages, setMessages, clearMessages } = useMessageStore();
  const { searchQuery, setSearchQuery, filteredMessages } = useMessageSearch(messages);
  const { isDarkMode, setIsDarkMode } = useThemeMode();
  const { speak } = useSpeechSynthesis();
  const { inputRef, scrollAreaRef, scrollToBottom } = useChatUI(messages);

  // Simple response generator (placeholder for actual AI)
  const getSimulatedResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! How can I help you today? Feel free to use **markdown** for formatting your messages or try asking me to *summarize* our conversation.";
    } 
    else if (input.includes("help") || input.includes("support")) {
      return "I'm here to help! What would you like to know about SpeakEasyAI?\n\n* Chat features\n* Voice commands\n* Markdown formatting";
    }
    else if (input.includes("markdown") || input.includes("format")) {
      return "You can use markdown in your messages:\n\n**Bold text** with double asterisks\n*Italic text* with single asterisks\n- Bullet points with dash\n\nGive it a try!";
    }
    else if (input.includes("voice") || input.includes("speak")) {
      return "You can use voice commands by clicking the microphone icon or pressing Ctrl+V. I can also read my responses out loud!";
    }
    else if (input.includes("summarize")) {
      // Create a simple summary of the conversation
      const userMessages = messages.filter(m => m.sender === "user");
      if (userMessages.length <= 1) {
        return "There's not much to summarize yet. Try chatting more!";
      }
      
      return "Here's a summary of our conversation:\n\n" + 
             userMessages.slice(0, 5).map(m => `- ${m.text.substring(0, 50)}${m.text.length > 50 ? '...' : ''}`).join('\n');
    }
    else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help with? 😊";
    }
    else {
      return "I understand you're asking about that. Once I'm connected to my AI brain, I'll be able to give you a more helpful response! In the meantime, try exploring our *markdown* **formatting** options or try the voice features.";
    }
  };

  // Handle voice message send
  const handleSendVoice = (transcript: string) => {
    if (!transcript.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: transcript,
      sender: "user",
      timestamp: new Date(),
      isVoiceMessage: true
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botResponse = getSimulatedResponse(transcript);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      
      // Speak the response
      speak(botResponse);
    }, 1500);
  };

  // Handle text message send
  const handleSendMessage = (text = input) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botResponse = getSimulatedResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Set up voice recognition
  const { isVoiceActive, toggleVoice } = useVoiceRecognition(handleSendVoice);

  // Summarize the conversation
  const summarize = () => handleSendMessage("summarize");

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
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  };

  return {
    messages,
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    setIsDarkMode,
    isVoiceActive,
    inputRef,
    scrollAreaRef,
    handleSend: handleSendMessage,
    handleClearChat,
    toggleVoice,
    summarize
  };
};
