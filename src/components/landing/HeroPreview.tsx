
import { useState } from "react";
import { Bot, Mic, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

const HeroPreview = () => {
  const { trackTryItYourself } = useAnalytics();
  const [animationState, setAnimationState] = useState('idle');
  
  const triggerAnimation = () => {
    setAnimationState('active');
    setTimeout(() => setAnimationState('idle'), 2000);
  };

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
        <div className="flex w-full max-w-md mb-4">
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
              <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className={`p-3 rounded-lg bg-muted text-left shadow-sm transform transition-all duration-300 hover:shadow-md ${animationState === 'active' ? 'scale-[1.03]' : 'hover:scale-[1.02]'}`}>
                <p className="text-sm">Welcome! I'm your AI speech coach. Would you like to practice a presentation, work on eliminating filler words, or get feedback on your delivery?</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex w-full max-w-md mb-4 justify-end">
          <div className="flex items-start gap-2 max-w-[80%] flex-row-reverse">
            <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shadow-sm">
              <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" />
            </div>
            <div>
              <div className={`p-3 rounded-lg bg-primary text-primary-foreground text-left shadow-sm transform transition-all duration-300 hover:shadow-md ${animationState === 'active' ? 'scale-[1.03]' : 'hover:scale-[1.02]'}`}>
                <p className="text-sm">I need help preparing for my team presentation. Can you help me eliminate my filler words?</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex w-full max-w-md">
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
              <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className={`p-3 rounded-lg bg-muted text-left shadow-sm transform transition-all duration-300 hover:shadow-md ${animationState === 'active' ? 'scale-[1.03]' : 'hover:scale-[1.02]'}`}>
                <p className="text-sm">Absolutely! Let's practice together. Try recording a short segment of your presentation, and I'll analyze your use of filler words and provide feedback.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          size="sm" 
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 mt-4 bg-primary/90 hover:bg-primary shadow-md transition-all duration-300 group hover:scale-105 ${animationState === 'active' ? 'animate-pulse' : ''}`}
          asChild
          onClick={(e) => {
            e.stopPropagation();
            trackTryItYourself();
          }}
        >
          <Link to="/chat" className="flex items-center">
            Try it yourself
            <ArrowRight className="ml-1 h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HeroPreview;
