
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewsletter } from '@/hooks/useNewsletter';
import LatestIssue from '@/components/newsletter/LatestIssue';
import NewsletterArchive from '@/components/newsletter/NewsletterArchive';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import NewsletterHeader from '@/components/newsletter/NewsletterHeader';

const NewsletterPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { latestIssue, archiveIssues, isLoading, error } = useNewsletter();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>SpeakEasyAI Newsletter | SpeakEasyAI</title>
        <meta name="description" content="Explore our monthly public speaking newsletter with insights, tips, and challenges." />
        <meta property="og:title" content="SpeakEasyAI Newsletter | SpeakEasyAI" />
        <meta property="og:description" content="Explore our monthly public speaking newsletter with insights, tips, and challenges." />
        <meta property="og:url" content="https://speakeasyai.com/newsletter" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <NewsletterHeader />
        
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="latest">Latest Issue</TabsTrigger>
            <TabsTrigger value="archive">Archives</TabsTrigger>
            <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest">
            {latestIssue && <LatestIssue issue={latestIssue} />}
          </TabsContent>
          
          <TabsContent value="archive">
            <NewsletterArchive 
              issues={archiveIssues} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
          
          <TabsContent value="subscribe">
            <NewsletterSignup onSubscribe={(email: string) => {
              // This will be handled by the NewsletterSignup component
              console.log('Newsletter subscription:', email);
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewsletterPage;
