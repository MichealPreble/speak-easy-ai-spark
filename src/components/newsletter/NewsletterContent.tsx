
import React from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';
import NewsletterSignup from './NewsletterSignup';
import LatestIssue from './LatestIssue';
import NewsletterArchive from './NewsletterArchive';
import NewsletterFeatures from './NewsletterFeatures';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

const NewsletterContent: React.FC = () => {
  const { latestIssue, archiveIssues, isLoading, error } = useNewsletter();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  
  const handleSubscribe = () => {
    // This would be handled by the NewsletterSignup component
    trackEvent('newsletter_subscribe', 'Newsletter', 'Subscription');
    toast({
      title: "Subscription Successful",
      description: "Thank you for subscribing to our monthly newsletter!",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="latest" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="latest">Latest Issue</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
          <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="latest" className="p-4">
          {error && (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <p className="text-red-600 dark:text-red-400">
                Unable to load the latest issue. Please try again later.
              </p>
            </div>
          )}
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : latestIssue ? (
            <LatestIssue issue={latestIssue} />
          ) : (
            <div className="text-center p-8 bg-primary/5 rounded-lg">
              <p className="text-muted-foreground">
                No issues published yet. Subscribe to be notified when our first issue is released!
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="archive" className="p-4">
          <NewsletterArchive issues={archiveIssues} isLoading={isLoading} error={error} />
        </TabsContent>
        
        <TabsContent value="subscribe" className="p-4">
          <NewsletterSignup onSubscribe={handleSubscribe} />
        </TabsContent>
      </Tabs>
      
      <NewsletterFeatures />
    </div>
  );
};

export default NewsletterContent;
