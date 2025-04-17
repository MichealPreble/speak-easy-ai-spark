
import { useState } from "react";
import HeroHeader from "./HeroHeader";
import HeroDescription from "./HeroDescription";
import HeroButtons from "./HeroButtons";
import HeroFeatures from "./HeroFeatures";
import HeroPreview from "./HeroPreview";
import HeroTestimonials from "./HeroTestimonials";
import SpeechTypeVisual from "./SpeechTypeVisual";
import { Bot, MessageSquare, Sun, Moon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useThemeMode } from "@/hooks/useThemeMode";

const Hero = () => {
  const fullText = "Practice speeches, receive balanced feedback, and craft compelling narratives with personalized AI coaching.";
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  
  // Speech types we support
  const speechTypes = [
    "Wedding Toasts",
    "Graduation Speeches",
    "Retirement Celebrations",
    "Conference Presentations",
    "Team Meetings",
    "Promotion Announcements",
    "Award Acceptance",
    "Keynote Addresses"
  ];
  
  // Example of custom conversation content
  const botMessages = [
    {
      content: "Welcome! I'm your AI speech coach. Would you like to practice a presentation, work on eliminating filler words, or get feedback on your delivery?",
      sender: 'bot' as const,
      icon: <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
    },
    {
      content: "Absolutely! Let's practice together. Try recording a short segment of your presentation, and I'll analyze your use of filler words and provide feedback.",
      sender: 'bot' as const,
      icon: <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
    }
  ];
  
  const userMessages = [
    {
      content: "I need help preparing for my team presentation. Can you help me eliminate my filler words?",
      sender: 'user' as const,
      icon: <MessageSquare className="h-4 w-4 text-secondary" aria-hidden="true" />
    }
  ];
  
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Background gradient elements with animations */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: "1s", animationDuration: "8s"}}></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-2xl opacity-50 animate-pulse" style={{animationDelay: "1.5s", animationDuration: "7s"}}></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/15 rounded-full filter blur-xl opacity-60 animate-pulse" style={{animationDelay: "2s", animationDuration: "9s"}}></div>
      
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <Toggle 
          pressed={isDarkMode} 
          onPressedChange={toggleDarkMode}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          className="w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 border border-border transition-all duration-300"
        >
          {isDarkMode ? 
            <Sun className="h-4 w-4 text-yellow-400" /> : 
            <Moon className="h-4 w-4 text-primary" />
          }
        </Toggle>
      </div>
      
      <div className="flex flex-col items-center text-center relative z-10">
        <HeroHeader />
        <HeroDescription fullText={fullText} speechTypes={speechTypes} />
        <HeroButtons />
        <HeroFeatures />
        
        {/* Add new speech type visual component */}
        <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
          <SpeechTypeVisual />
        </div>
        
        <div className="w-full max-w-4xl mx-auto mt-8 mb-20">
          <HeroPreview 
            botMessages={botMessages}
            userMessages={userMessages}
            ctaText="Try it yourself"
            ctaLink="/chat"
          />
        </div>
        
        <HeroTestimonials />
      </div>

      <style>
        {`
        @keyframes drawing {
          0% {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
        }
        .animate-drawing {
          animation: drawing 1.5s ease-in-out forwards;
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        `}
      </style>
    </section>
  );
};

export default Hero;
