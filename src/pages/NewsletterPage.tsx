
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NewsletterHeader from '@/components/newsletter/NewsletterHeader';
import NewsletterContent from '@/components/newsletter/NewsletterContent';

const NewsletterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Monthly Public Speaking Newsletter | SpeakEasyAI</title>
        <meta name="description" content="Subscribe to our premium monthly newsletter for public speaking tips, techniques, and insights." />
        <meta property="og:title" content="Monthly Public Speaking Newsletter | SpeakEasyAI" />
        <meta property="og:description" content="Subscribe to our premium monthly newsletter for public speaking tips, techniques, and insights." />
        <meta property="og:url" content="https://speakeasyai.com/newsletter" />
      </Helmet>
      <NewsletterHeader />
      <NewsletterContent />
    </div>
  );
};

export default NewsletterPage;
