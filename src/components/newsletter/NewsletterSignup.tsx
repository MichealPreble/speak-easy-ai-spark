
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Mail } from 'lucide-react';

interface NewsletterSignupProps {
  onSubscribe: () => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubscribe }) => {
  const { trackEvent } = useAnalytics();

  const handleSignupInteraction = () => {
    trackEvent('subscribe_newsletter', 'Newsletter', 'Signup Form Interaction');
    onSubscribe();
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
        <div className="flex flex-col items-center space-y-4">
          <Mail className="h-12 w-12 text-primary opacity-80" />
          <iframe
            src="https://embeds.beehiiv.com/459544e2-b4ac-473d-b735-38470ab16e0c?slim=true"
            data-test-id="beehiiv-embed"
            height="52"
            frameBorder="0"
            scrolling="no"
            style={{ margin: 0, borderRadius: '0px', backgroundColor: 'transparent' }}
            onLoad={handleSignupInteraction}
          ></iframe>
        </div>
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
