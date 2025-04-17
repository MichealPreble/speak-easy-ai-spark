
import React from 'react';
import { Sparkles, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NewsletterHeader: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <Badge 
        variant="outline" 
        className="px-4 py-2 text-base font-medium bg-primary/10 backdrop-blur-sm hover:bg-primary/15 transition-all duration-300 mb-6"
      >
        <Mail className="h-6 w-6 text-primary mr-2 animate-pulse" aria-hidden="true" style={{animationDuration: "4s"}} />
        <span>Premium Monthly Newsletter</span>
        <Sparkles className="h-5 w-5 text-primary/70 ml-2" />
      </Badge>
      
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
        SpeakEasy
        <span className="text-primary relative inline-block ml-2">
          Monthly
          <svg className="absolute w-full h-3 -bottom-1 left-0" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path 
              d="M0,5 Q25,0 50,5 T100,5" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              className="animate-drawing" 
            />
          </svg>
        </span>
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
        A premium resource for ambitious communicators, public speakers, 
        and professionals looking to elevate their speaking skills.
      </p>
    </div>
  );
};

export default NewsletterHeader;
