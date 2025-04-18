
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

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
    <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Subscribe to Our Monthly Newsletter</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Mail className="h-12 w-12 text-mint-500 opacity-80" />
          <p className="text-center text-gray-600">
            Get premium public speaking tips, techniques, and insights delivered to your inbox once a month.
          </p>
          
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
    </Card>
  );
};

export default NewsletterSignup;
