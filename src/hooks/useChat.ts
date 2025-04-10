
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";

export const useChat = () => {
  const { toast } = useToast();
  
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
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for system preference or localStorage
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat messages:", error);
    }
  }, [messages]);
  
  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableArea) {
        scrollableArea.scrollTop = scrollableArea.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Simple response generator (placeholder for actual AI)
  const getSimulatedResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! How can I help you today? Feel free to use **markdown** for formatting your messages.";
    } 
    else if (input.includes("help") || input.includes("support")) {
      return "I'm here to help! What would you like to know about SpeakEasyAI?\n\n* Chat features\n* Pricing plans\n* Technical support";
    }
    else if (input.includes("markdown") || input.includes("format")) {
      return "You can use markdown in your messages:\n\n**Bold text** with double asterisks\n*Italic text* with single asterisks\n- Bullet points with dash\n\nGive it a try!";
    }
    else if (input.includes("price") || input.includes("cost") || input.includes("plan")) {
      return "SpeakEasyAI offers several pricing plans to suit your needs:\n\n* **Free tier**: Basic conversations\n* **Pro tier**: $9.99/month with advanced features\n* **Enterprise**: Custom pricing for teams\n\nCheck out our pricing page for more details.";
    }
    else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help with? 😊";
    }
    else {
      return "I understand you're asking about that. Once I'm connected to my AI brain, I'll be able to give you a more helpful response! In the meantime, try exploring our *markdown* **formatting** options.";
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response (will be replaced with actual API call later)
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getSimulatedResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Clear all messages except the initial greeting
  const handleClearChat = () => {
    const initialMessage: Message = {
      id: Date.now(),
      text: "Hi there! I'm SpeakEasyAI. How can I assist you today?\n\nTry typing **bold** or *italic* text for formatting!",
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery.trim() 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

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
    inputRef,
    scrollAreaRef,
    handleSend,
    handleClearChat
  };
};
