
import { Bot, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 pt-20 pb-12 md:pt-32 md:pb-24">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <Mic className="h-6 w-6 text-primary mr-2" aria-hidden="true" />
          <span className="text-sm font-medium">Public Speaking AI Assistant</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          SpeakEasy<span className="text-primary">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
          Master public speaking with personalized AI coaching. Practice speeches, receive balanced feedback, and craft compelling narratives with the power of AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" asChild className="text-base">
            <Link to="/chat">Start Practicing</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base">
            <a href="#features">Explore Features</a>
          </Button>
        </div>
        
        <div 
          className="relative w-full max-w-4xl h-[300px] md:h-[400px] rounded-lg bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 border border-border shadow-md overflow-hidden"
          role="img"
          aria-label="AI Speech Coach Conversation Preview"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="flex w-full max-w-md mb-4">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="p-3 rounded-lg bg-muted text-left">
                    <p className="text-sm">Welcome! I'm your AI speech coach. Would you like to practice a presentation, work on eliminating filler words, or get feedback on your delivery?</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex w-full max-w-md mb-4 justify-end">
              <div className="flex items-start gap-2 max-w-[80%] flex-row-reverse">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" />
                </div>
                <div>
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground text-left">
                    <p className="text-sm">I need help preparing for my team presentation. Can you help me eliminate my filler words?</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex w-full max-w-md">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="p-3 rounded-lg bg-muted text-left">
                    <p className="text-sm">Absolutely! Let's practice together. Try recording a short segment of your presentation, and I'll analyze your use of filler words and provide feedback.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 mt-4"
              asChild
            >
              <Link to="/chat">Try it yourself</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
