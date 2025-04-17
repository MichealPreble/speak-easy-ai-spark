
import React from "react";
import { Mic, BarChart2, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-background" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How SpeakEasyAI Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Improve your speaking skills in minutes with our AI-powered speech analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Timer className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Record a Speech</h3>
            <p className="text-muted-foreground">
              Try our 1-minute speech practice feature - just click the timer icon and start speaking
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Get Real-time Feedback</h3>
            <p className="text-muted-foreground">
              Watch your speech metrics update in real-time as you speak
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Review Analysis</h3>
            <p className="text-muted-foreground">
              Get detailed metrics on pace, volume, enunciation, vocabulary level, and more
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">4. Improve Steadily</h3>
            <p className="text-muted-foreground">
              Follow personalized improvement tips and watch your progress over time
            </p>
          </div>
        </div>

        <div className="bg-primary/5 p-8 rounded-xl text-center mx-auto max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">Try Free 1-Minute Speech Evaluation</h3>
          <p className="text-muted-foreground mb-6">
            No sign-up required. Get instant feedback on your speaking skills including volume, enunciation, 
            grade level analysis, and more.
          </p>
          <Link to="/chat">
            <Button size="lg" className="bg-primary hover:bg-primary/80">
              <Timer className="mr-2 h-5 w-5" />
              Try 1-Minute Practice
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
