
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
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

    toast({
      title: "Thanks for subscribing!",
      description: "We'll keep you updated on our launch",
    });
    setEmail("");
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
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
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
