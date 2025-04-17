
import React from 'react';
import { Mic, Volume2, BookOpen, GraduationCap } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How SpeakEasyAI Works</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Record</h3>
            <p className="text-muted-foreground">
              Record a 1-minute speech practice session in a distraction-free environment.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Volume2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Volume & Enunciation</h3>
            <p className="text-muted-foreground">
              Get real-time feedback on your speaking volume and pronunciation clarity.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Vocabulary</h3>
            <p className="text-muted-foreground">
              Analyze the complexity and grade level of the words you use in your speech.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Improvement</h3>
            <p className="text-muted-foreground">
              Receive personalized tips to help you improve your public speaking skills.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SpeakEasyAI provides a free, comprehensive speech analysis tool that helps you 
            become a more confident and effective communicator.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
