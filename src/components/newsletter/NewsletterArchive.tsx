
import React, { useState } from 'react';
import { NewsletterIssue } from '@/hooks/useNewsletter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface NewsletterArchiveProps {
  issues: NewsletterIssue[];
  isLoading: boolean;
  error: string | null;
}

const NewsletterArchive: React.FC<NewsletterArchiveProps> = ({ issues, isLoading, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { trackEvent } = useAnalytics();
  
  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    issue.previewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleViewIssue = (issue: NewsletterIssue) => {
    trackEvent('view_archive_issue', 'Newsletter', issue.slug);
    window.open(`https://speakeasyai.beehiiv.com/${issue.slug}`, '_blank');
  };

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          Unable to load archived issues. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issues by title, content, or tag..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredIssues.length === 0 ? (
        <div className="text-center p-8 bg-primary/5 rounded-lg">
          <p className="text-muted-foreground">
            No issues found matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map(issue => (
            <Card key={issue.id} className="overflow-hidden backdrop-blur-sm border border-primary/10 bg-background/80 flex flex-col md:flex-row">
              {issue.featuredImage && (
                <div className="w-full md:w-1/4 h-40 overflow-hidden">
                  <img 
                    src={issue.featuredImage} 
                    alt={issue.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time dateTime={issue.publishDate}>
                      {new Date(issue.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                  <CardTitle className="text-xl font-bold">{issue.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{issue.previewText}</CardDescription>
                </CardHeader>
                
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 h-auto"
                    onClick={() => handleViewIssue(issue)}
                  >
                    Read Issue →
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsletterArchive;
