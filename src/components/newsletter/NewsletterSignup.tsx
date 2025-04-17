
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle } from 'lucide-react';

interface NewsletterSignupProps {
  onSubscribe: (email: string) => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // This would make an actual API call to Beehiiv
      // const response = await fetch('https://api.beehiiv.com/v2/publications/pub_459544e2-b4ac-473d-b735-38470ab16e0c/subscribers', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ email })
      // });
      
      // For now, simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onSubscribe callback
      onSubscribe(email);
      
      // Show success state
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing you to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm border border-primary/10 bg-background/80">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Subscribe to Our Monthly Newsletter</CardTitle>
        <CardDescription>
          Get premium public speaking tips, techniques, and insights delivered to your inbox once a month.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSubscribed ? (
          <div className="text-center p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Thank You for Subscribing!</h3>
            <p className="text-muted-foreground">
              You're now on the list to receive our premium monthly newsletter.
              Check your email for a confirmation message.
            </p>
            <Button variant="outline" onClick={() => setIsSubscribed(false)}>
              Subscribe Another Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="sm:w-auto w-full">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              By subscribing, you agree to receive our newsletter and accept our{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              We respect your privacy and will never share your information.
            </p>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="text-center">
            <h4 className="font-medium">Premium Content</h4>
            <p className="text-sm text-muted-foreground">Deep insights in each issue</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium">Monthly Delivery</h4>
            <p className="text-sm text-muted-foreground">Quality over quantity</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium">Actionable Tips</h4>
            <p className="text-sm text-muted-foreground">Apply skills immediately</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsletterSignup;
