
import { useState } from "react";
import HeroHeader from "./HeroHeader";
import HeroDescription from "./HeroDescription";
import HeroButtons from "./HeroButtons";
import HeroFeatures from "./HeroFeatures";
import HeroPreview from "./HeroPreview";

const Hero = () => {
  const fullText = "Practice speeches, receive balanced feedback, and craft compelling narratives with personalized AI coaching.";
  
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Background gradient elements with animations */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: "1s", animationDuration: "8s"}}></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-2xl opacity-50 animate-pulse" style={{animationDelay: "1.5s", animationDuration: "7s"}}></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/15 rounded-full filter blur-xl opacity-60 animate-pulse" style={{animationDelay: "2s", animationDuration: "9s"}}></div>
      
      <div className="flex flex-col items-center text-center relative z-10">
        <HeroHeader />
        <HeroDescription fullText={fullText} />
        <HeroButtons />
        <HeroFeatures />
        <HeroPreview />
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
