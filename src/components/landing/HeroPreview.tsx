
import { useState } from "react";
import { Bot, Mic, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

export type ChatMessage = {
  sender: 'bot' | 'user';
  content: string;
  icon?: React.ReactNode;
}

type HeroPreviewProps = {
  botMessages?: ChatMessage[];
  userMessages?: ChatMessage[];
  ctaText?: string;
  ctaLink?: string;
}

const HeroPreview = ({
  botMessages = [
    {
      content: "Welcome! I'm your AI speech coach. Would you like to practice a presentation, work on eliminating filler words, or get feedback on your delivery?",
      sender: 'bot',
      icon: <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
    },
    {
      content: "Absolutely! Let's practice together. Try recording a short segment of your presentation, and I'll analyze your use of filler words and provide feedback.",
      sender: 'bot',
      icon: <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
    }
  ],
  userMessages = [
    {
      content: "I need help preparing for my team presentation. Can you help me eliminate my filler words?",
      sender: 'user',
      icon: <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" />
    }
  ],
  ctaText = "Try it yourself",
  ctaLink = "/chat"
}: HeroPreviewProps) => {
  const { trackTryItYourself } = useAnalytics();
  const [animationState, setAnimationState] = useState('idle');
  
  const triggerAnimation = () => {
    setAnimationState('active');
    setTimeout(() => setAnimationState('idle'), 2000);
  };

  // Interleave bot and user messages in correct order
  const getOrderedMessages = () => {
    const messages: ChatMessage[] = [];
    // Start with first bot message
    if (botMessages.length > 0) {
      messages.push(botMessages[0]);
    }
    
    // Add first user message if available
    if (userMessages.length > 0) {
      messages.push(userMessages[0]);
    }
    
    // Add second bot message if available
    if (botMessages.length > 1) {
      messages.push(botMessages[1]);
    }
    
    return messages;
  };

  const orderedMessages = getOrderedMessages();

  return (
    <div 
      className={`relative w-full max-w-4xl h-[300px] md:h-[400px] rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 border border-border shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm transform hover:translate-y-[-5px] ${animationState === 'active' ? 'scale-[1.02]' : ''}`}
      role="img"
      aria-label="AI Speech Coach Conversation Preview"
      onClick={triggerAnimation}
    >
      {/* Enhanced decorative elements with staggered animations */}
      <div className="absolute top-6 right-6 h-2 w-2 rounded-full bg-primary animate-ping"></div>
      <div className="absolute top-6 right-10 h-2 w-2 rounded-full bg-secondary animate-ping" style={{animationDelay: "0.5s", animationDuration: "2s"}}></div>
      <div className="absolute top-6 right-14 h-2 w-2 rounded-full bg-primary/50 animate-ping" style={{animationDelay: "1s", animationDuration: "2.5s"}}></div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        {orderedMessages.map((message, index) => (
          <div key={index} className={`flex w-full max-w-md mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full ${message.sender === 'user' ? 'bg-secondary/20' : 'bg-primary/20'} flex items-center justify-center shadow-sm`}>
                {message.icon || (message.sender === 'user' ? 
                  <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" /> : 
                  <Bot className="h-4 w-4 text-primary" aria-hidden="true" />)}
              </div>
              <div>
                <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} text-left shadow-sm transform transition-all duration-300 hover:shadow-md ${animationState === 'active' ? 'scale-[1.03]' : 'hover:scale-[1.02]'}`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          size="sm" 
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 mt-4 bg-primary/90 hover:bg-primary shadow-md transition-all duration-300 group hover:scale-105 ${animationState === 'active' ? 'animate-pulse' : ''}`}
          asChild
          onClick={(e) => {
            e.stopPropagation();
            trackTryItYourself();
          }}
        >
          <Link to={ctaLink} className="flex items-center">
            {ctaText}
            <ArrowRight className="ml-1 h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HeroPreview;
