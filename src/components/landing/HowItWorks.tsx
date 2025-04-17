
import React from 'react';
import { Mic, Volume2, BookOpen, GraduationCap, Brain, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium bg-primary/10 dark:bg-primary/20">
            Our Process
          </Badge>
          <h2 className="text-3xl font-bold mb-4">How SpeakEasyAI Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform analyzes your speech patterns and provides actionable feedback to help you improve.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Record</h3>
            <p className="text-muted-foreground">
              Record a 1-minute speech practice session in a distraction-free environment.
            </p>
            
            <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="relative text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Volume2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Volume & Enunciation</h3>
            <p className="text-muted-foreground">
              Get real-time feedback on your speaking volume and pronunciation clarity.
            </p>
            
            <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="relative text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Vocabulary</h3>
            <p className="text-muted-foreground">
              Analyze the complexity and grade level of the words you use in your speech.
            </p>
            
            <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Improvement</h3>
            <p className="text-muted-foreground">
              Receive personalized tips to help you improve your public speaking skills for any occasion.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <div className="p-6 bg-background border border-border rounded-lg shadow-sm max-w-2xl mx-auto">
            <p className="text-lg font-medium mb-4">
              Ready to try a free 1-minute speech analysis?
            </p>
            <p className="text-muted-foreground mb-6">
              SpeakEasyAI provides comprehensive speech analysis that helps you become a more confident 
              and effective communicator for weddings, graduations, work presentations, and more.
            </p>
            <a 
              href="/chat" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
