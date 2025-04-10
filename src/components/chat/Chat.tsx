
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Trash2, Search, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const Chat = () => {
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery.trim() 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col h-[600px] w-full border rounded-lg shadow-md bg-card">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">SpeakEasyAI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearChat}
            aria-label="Clear chat history"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
            aria-label="Search messages"
          />
        </div>
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 p-4" aria-live="polite" ref={scrollAreaRef}>
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={
                      msg.sender === "bot" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary/10 text-secondary"
                    }>
                      {msg.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 mx-1">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {searchQuery ? "No messages found matching your search." : "No messages yet."}
            </p>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
          aria-label="Send a message"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message... (supports markdown)"
            className="flex-1"
            disabled={isLoading}
            aria-label="Message input"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
