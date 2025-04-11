
import { Bot, Mic, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 pt-20 pb-12 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Enhanced background gradient elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-2xl opacity-50 animate-pulse" style={{animationDelay: "1.5s"}}></div>
      
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 backdrop-blur-sm shadow-sm">
          <Mic className="h-6 w-6 text-primary mr-2" aria-hidden="true" />
          <span className="text-sm font-medium">Public Speaking AI Assistant</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Master Public Speaking with <span className="text-primary relative inline-block">
            SpeakEasy<span className="text-primary">AI</span>
            <svg className="absolute w-full h-3 -bottom-1 left-0" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q25,0 50,5 T100,5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
          Practice speeches, receive balanced feedback, and craft compelling narratives with personalized AI coaching.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" asChild className="text-base group transition-all duration-300 shadow-lg hover:shadow-primary/25 relative overflow-hidden">
            <Link to="/chat">
              <span className="relative z-10 flex items-center">
                Start Practicing 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-primary opacity-100 group-hover:opacity-90 transition-opacity"></span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base border-primary/20 hover:bg-primary/5">
            <a href="#features">Explore Features</a>
          </Button>
        </div>
        
        <div 
          className="relative w-full max-w-4xl h-[300px] md:h-[400px] rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 border border-border shadow-lg overflow-hidden backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
          role="img"
          aria-label="AI Speech Coach Conversation Preview"
        >
          {/* Enhanced decorative elements */}
          <div className="absolute top-6 right-6 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          <div className="absolute top-6 right-10 h-2 w-2 rounded-full bg-secondary animate-pulse" style={{animationDelay: "0.5s"}}></div>
          <div className="absolute top-6 right-14 h-2 w-2 rounded-full bg-primary/50 animate-pulse" style={{animationDelay: "1s"}}></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="flex w-full max-w-md mb-4">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="p-3 rounded-lg bg-muted text-left shadow-sm">
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
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground text-left shadow-sm">
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
                  <div className="p-3 rounded-lg bg-muted text-left shadow-sm">
                    <p className="text-sm">Absolutely! Let's practice together. Try recording a short segment of your presentation, and I'll analyze your use of filler words and provide feedback.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 mt-4 bg-primary/90 hover:bg-primary shadow-md transition-all duration-300 group"
              asChild
            >
              <Link to="/chat" className="flex items-center">
                Try it yourself
                <ArrowRight className="ml-1 h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
