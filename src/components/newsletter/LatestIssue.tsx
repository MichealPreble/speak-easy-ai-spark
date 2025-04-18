
import React from 'react';
import { NewsletterIssue } from '@/hooks/useNewsletter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Share2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface LatestIssueProps {
  issue: NewsletterIssue;
}

const LatestIssue: React.FC<LatestIssueProps> = ({ issue }) => {
  const { trackEvent } = useAnalytics();
  
  const handleViewFull = () => {
    // This would redirect to the full issue view or open Beehiiv reader
    trackEvent('view_full_issue', 'Newsletter', issue.slug);
    window.open(`https://speakeasyai.beehiiv.com/${issue.slug}`, '_blank');
  };
  
  const handleShare = () => {
    // This would open a share dialog
    trackEvent('share_issue', 'Newsletter', issue.slug);
    
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.preview_text,
        url: `https://speakeasyai.beehiiv.com/${issue.slug}`,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`https://speakeasyai.beehiiv.com/${issue.slug}`);
      alert('Link copied to clipboard!');
    }
  };

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

export default LatestIssue;
