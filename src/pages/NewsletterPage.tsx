
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useNewsletter } from '@/hooks/useNewsletter';
import NewsletterLatestIssue from '@/components/newsletter/NewsletterLatestIssue';
import NewsletterArchive from '@/components/newsletter/NewsletterArchive';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';

const NewsletterPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [blogTag, setBlogTag] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;
  const { latestIssue, archiveIssues, isLoading, error } = useNewsletter();
  const { trackEvent } = useAnalytics();

  const handleTabChange = (value: string) => {
    trackEvent(`view_${value}_tab`, 'Newsletter', `${value.charAt(0).toUpperCase() + value.slice(1)} Tab`);
  };

  const handleSubscribe = () => {
    trackEvent('subscribe_newsletter', 'Newsletter', 'Subscribed');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>SpeakEasyAI Newsletter | SpeakEasyAI</title>
        <meta name="description" content="Explore our monthly public speaking newsletter with insights, tips, and challenges." />
        <meta property="og:title" content="SpeakEasyAI Newsletter | SpeakEasyAI" />
        <meta property="og:description" content="Explore our monthly public speaking newsletter with insights, tips, and challenges." />
        <meta property="og:url" content="https://speakeasyai.com/newsletter" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">SpeakEasyAI Newsletter</h1>
      <Tabs defaultValue="latest" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md border-none">
          <TabsTrigger value="latest" className="text-gray-600 hover:text-mint-500" aria-label="View Latest Issue">
            Latest Issue
          </TabsTrigger>
          <TabsTrigger value="archive" className="text-gray-600 hover:text-mint-500" aria-label="View Archives">
            Archives
          </TabsTrigger>
          <TabsTrigger value="subscribe" className="text-gray-600 hover:text-mint-500" aria-label="Subscribe to Newsletter">
            Subscribe
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="latest">
          <NewsletterLatestIssue issue={latestIssue} isLoading={isLoading} error={error} />
        </TabsContent>
        
        <TabsContent value="archive">
          <NewsletterArchive
            issues={archiveIssues}
            isLoading={isLoading} 
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="subscribe">
          <NewsletterSignup onSubscribe={handleSubscribe} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterPage;
