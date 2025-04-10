
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
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendVoice(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsVoiceActive(false);
        toast({
          title: "Voice recognition error",
          description: "Could not recognize speech. Please try again.",
        });
      };

      recognitionRef.current.onend = () => {
        setIsVoiceActive(false);
      };
    }

    // Setup keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+V for voice toggle
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        toggleVoice();
      }
      // Ctrl+S for summarize
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSendMessage('summarize');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Stop recognition if active when component unmounts
      if (recognitionRef.current && isVoiceActive) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

  // Toggle voice recognition
  const toggleVoice = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Try Chrome or Edge.",
      });
      return;
    }

    if (isVoiceActive) {
      recognitionRef.current.stop();
      setIsVoiceActive(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsVoiceActive(true);
        toast({
          title: "Voice recognition active",
          description: "Speak now...",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Voice recognition error",
          description: "Could not start voice recognition. Please try again.",
        });
      }
    }
  };

  // Text-to-speech for bot responses
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Clean text from markdown for better speech
      const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1')
                           .replace(/\*(.*?)\*/g, '$1')
                           .replace(/`(.*?)`/g, '$1');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
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
    messages: filteredMessages,
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
    summarize: () => handleSendMessage("summarize")
  };
};
