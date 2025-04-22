import React from 'react';
import { NewsletterIssue } from '@/types/newsletter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Share2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsletterLatestIssueProps {
  issue: NewsletterIssue | null;
  isLoading: boolean;
  error: string | null;
}

const NewsletterLatestIssue: React.FC<NewsletterLatestIssueProps> = ({ issue, isLoading, error }) => {
  const { trackEvent } = useAnalytics();
  
  const handleViewFull = () => {
    if (!issue) return;
    trackEvent('view_full_issue', 'Newsletter', issue.slug);
    window.open(`https://speakeasyai.beehiiv.com/${issue.slug}`, '_blank');
  };
  
  const handleShare = () => {
    if (!issue) return;
    trackEvent('share_issue', 'Newsletter', issue.slug);
    
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.preview_text,
        url: `https://speakeasyai.beehiiv.com/${issue.slug}`,
      });
    } else {
      navigator.clipboard.writeText(`https://speakeasyai.beehiiv.com/${issue.slug}`);
      alert('Link copied to clipboard!');
    }
  };

  if (error) {
    return (
      <Card className="w-full overflow-hidden backdrop-blur-sm border border-primary/10 bg-background/80">
        <CardContent className="pt-6">
          <div className="text-center text-red-500 p-8">
            <p>Error loading the newsletter: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden backdrop-blur-sm border border-primary/10 bg-background/80">
        <div className="w-full h-64 bg-gray-200 animate-pulse" />
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
        </CardFooter>
      </Card>
    );
  }

  if (!issue) {
    return (
      <Card className="w-full overflow-hidden backdrop-blur-sm border border-primary/10 bg-background/80">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <p>No newsletter issues available yet. Please check back later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden backdrop-blur-sm border border-primary/10 bg-background/80">
      {issue.featured_image && (
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={issue.featured_image} 
            alt={issue.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <time dateTime={issue.published_at}>
            {new Date(issue.published_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold">{issue.title}</CardTitle>
        <CardDescription className="text-lg mt-2">{issue.preview_text}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {issue.blogTag && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {issue.blogTag.replace(/-/g, ' ')}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button onClick={handleViewFull} className="flex-1 mr-2">
          Read Full Issue
        </Button>
        <Button variant="outline" onClick={handleShare} className="px-4">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsletterLatestIssue;
