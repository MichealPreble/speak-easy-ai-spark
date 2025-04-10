
import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

export function useMessageStore() {
  // Load messages from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('chatMessages');
      return saved
        ? JSON.parse(saved, (key, value) =>
            key === 'timestamp' ? new Date(value) : value
          )
        : [
            {
              id: 1,
              text: "Hi there! I'm SpeakEasyAI. How can I assist you today?\n\nTry typing **bold** or *italic* text for formatting!",
              sender: "bot",
              timestamp: new Date(),
            },
          ];
    } catch (error) {
      console.error("Error loading chat messages:", error);
      return [
        {
          id: 1,
          text: "Hi there! I'm SpeakEasyAI. How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ];
    }
  });

  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat messages:", error);
    }
  }, [messages]);

  // Clear all messages except the initial greeting
  const clearMessages = () => {
    const initialMessage: Message = {
      id: Date.now(),
      text: "Hi there! I'm SpeakEasyAI. How can I assist you today?\n\nTry typing **bold** or *italic* text for formatting!",
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
  };

  return {
    messages,
    setMessages,
    clearMessages
  };
}
