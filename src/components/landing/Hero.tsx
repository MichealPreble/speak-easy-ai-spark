
import { Bot, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 pt-20 pb-12 md:pt-32 md:pb-24">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <Mic className="h-6 w-6 text-primary mr-2" />
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
        
        <div className="relative w-full max-w-4xl h-[300px] md:h-[400px] rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MessageSquare className="w-16 h-16 md:w-24 md:h-24 text-primary/40" />
          </div>
          <span className="relative z-10 text-lg md:text-xl font-medium">AI Speech Coach Preview Coming Soon</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
