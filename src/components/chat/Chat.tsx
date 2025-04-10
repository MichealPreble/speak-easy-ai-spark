
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
              text: "Hi there! I'm SpeakEasyAI. How can I assist you today?",
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
      text: "Hi there! I'm SpeakEasyAI. How can I assist you today?",
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
      return "Hello! How can I help you today?";
    } 
    else if (input.includes("help") || input.includes("support")) {
      return "I'm here to help! What would you like to know about SpeakEasyAI?";
    }
    else if (input.includes("price") || input.includes("cost") || input.includes("plan")) {
      return "SpeakEasyAI offers several pricing plans to suit your needs. Check out our pricing page for more details.";
    }
    else if (input.includes("feature")) {
      return "SpeakEasyAI comes with advanced conversation capabilities, multilingual support, and custom training options.";
    }
    else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help with?";
    }
    else {
      return "I understand you're asking about that. Once I'm connected to my AI brain, I'll be able to give you a more helpful response!";
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px] w-full border rounded-lg shadow-md bg-card" ref={scrollAreaRef}>
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">SpeakEasyAI Assistant</h3>
        </div>
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

      {/* Message List */}
      <ScrollArea className="flex-1 p-4" aria-live="polite">
        <div className="space-y-4">
          {messages.map((msg) => (
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
                  {msg.sender === "bot" ? (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 mx-1">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
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
            placeholder="Type your message..."
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
