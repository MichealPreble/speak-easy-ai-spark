
import { MessageSquare, Zap, ShieldCheck } from "lucide-react";

const Features = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Powerful Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Natural Conversations</h3>
          <p className="text-muted-foreground">
            Engage in fluid, human-like conversations with our sophisticated AI model.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
          <p className="text-muted-foreground">
            Get instant responses with our optimized AI processing system.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
          <p className="text-muted-foreground">
            Your conversations are encrypted and never stored without your permission.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
