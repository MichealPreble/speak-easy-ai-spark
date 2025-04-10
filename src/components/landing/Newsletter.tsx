
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Show loading state
    setIsSubmitting(true);
    
    // Simulate subscription with a timeout
    setTimeout(() => {
      toast({
        title: "Thanks for subscribing!",
        description: "We'll keep you updated on our launch",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-24" id="newsletter">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <Mail className="h-12 w-12 text-primary/50" aria-hidden="true" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-muted-foreground mb-6">
          Join our newsletter to get updates about new features and releases.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
