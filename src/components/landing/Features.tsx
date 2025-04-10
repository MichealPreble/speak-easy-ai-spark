
import { MessageSquare, Mic, BookOpen, Award, PenTool, Lightbulb } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-12 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Public Speaking Excellence
      </h2>
      <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
        From beginners to experts, SpeakEasyAI helps you master the art of public speaking through personalized practice and guidance.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Expert-Level Practice</h3>
          <p className="text-muted-foreground">
            Practice speeches with real-time feedback on pacing, tone, and filler words. Perfect for speakers at any level.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <PenTool className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Story-Driven Speeches</h3>
          <p className="text-muted-foreground">
            Craft compelling speeches with AI guidance that helps weave personal stories for maximum audience impact.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Balanced Feedback</h3>
          <p className="text-muted-foreground">
            Receive both positive reinforcement and constructive criticism to build confidence while improving your skills.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Speech Structure</h3>
          <p className="text-muted-foreground">
            Learn to organize your thoughts with AI guidance on creating impactful introductions, supporting points, and memorable conclusions.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Delivery Mastery</h3>
          <p className="text-muted-foreground">
            Perfect your delivery with feedback on voice modulation, eye contact cues, and audience engagement techniques.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Conversational Coach</h3>
          <p className="text-muted-foreground">
            Interact naturally with an AI coach that understands your goals and adapts to your speaking style and experience level.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
