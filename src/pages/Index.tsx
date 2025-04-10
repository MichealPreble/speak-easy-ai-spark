import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, MessageSquare, Zap, ShieldCheck, Star, Mail, User, Send } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Index = () => {
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

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onContactSubmit(data: ContactFormValues) {
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    console.log("Contact form data:", data);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-12 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Bot className="h-6 w-6 text-primary mr-2" />
            <span className="text-sm font-medium">AI-Powered Conversations</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            SpeakEasy<span className="text-primary">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
            Natural conversations with state-of-the-art AI. Engage, learn, and create with the power of advanced language models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="text-base">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Learn More
            </Button>
          </div>
          
          <div className="relative w-full max-w-4xl h-[300px] md:h-[400px] rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageSquare className="w-16 h-16 md:w-24 md:h-24 text-primary/40" />
            </div>
            <span className="relative z-10 text-lg md:text-xl font-medium">AI Preview Coming Soon</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Pricing Teaser */}
      <section className="container mx-auto px-4 py-12 md:py-24 bg-accent/5 rounded-2xl my-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
          <div className="flex-1 p-8 rounded-xl border bg-card flex flex-col max-w-md mx-auto md:mx-0">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-muted-foreground mb-1">Free</h3>
              <div className="text-4xl font-bold mb-1">$0</div>
              <p className="text-sm text-muted-foreground">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>10 messages per day</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>Basic conversation capabilities</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>Standard response time</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Sign Up Free</Button>
          </div>
          <div className="flex-1 p-8 rounded-xl border-2 border-primary bg-card flex flex-col relative max-w-md mx-auto md:mx-0">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
              POPULAR
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-muted-foreground mb-1">Premium</h3>
              <div className="text-4xl font-bold mb-1">$15</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>Unlimited messages</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>Advanced AI capabilities</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>Priority response time</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-primary mr-2" />
                <span>File uploads and analysis</span>
              </li>
            </ul>
            <Button className="w-full">Get Premium</Button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Have questions about SpeakEasyAI? We'd love to hear from you!
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onContactSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                        <User className="h-5 w-5 ml-3 text-muted-foreground" />
                        <Input 
                          placeholder="Your name" 
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                        <Mail className="h-5 w-5 ml-3 text-muted-foreground" />
                        <Input 
                          type="email" 
                          placeholder="Your email" 
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How can we help you?" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </form>
          </Form>
        </div>
      </section>

      {/* Newsletter Section */}
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

      {/* Footer */}
      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-bold">SpeakEasyAI</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                © {new Date().getFullYear()} SpeakEasyAI. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
