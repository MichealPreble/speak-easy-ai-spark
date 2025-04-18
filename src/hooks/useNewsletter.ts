
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NewsletterIssue {
  id: string;
  title: string;
  publishDate: string;
  slug: string;
  previewText: string;
  featuredImage?: string;
  content?: string;
  tags: string[];
}

export function useNewsletter() {
  const [latestIssue, setLatestIssue] = useState<NewsletterIssue | null>(null);
  const [archiveIssues, setArchiveIssues] = useState<NewsletterIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNewsletterData = async () => {
      setIsLoading(true);
      
      try {
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          issues: [
            {
              id: '1',
              title: 'The Art of Vocal Variety',
              publishDate: '2025-04-01',
              slug: 'art-of-vocal-variety',
              previewText: 'Discover techniques to engage your audience through the power of your voice.',
              featuredImage: 'https://picsum.photos/800/450',
              tags: ['vocal-techniques', 'engagement']
            },
            {
              id: '2',
              title: 'Mastering the Stage: Movement and Presence',
              publishDate: '2025-03-01',
              slug: 'mastering-the-stage',
              previewText: 'How to command any stage with confidence and purpose.',
              featuredImage: 'https://picsum.photos/800/451',
              tags: ['stage-presence', 'body-language']
            },
            {
              id: '3',
              title: 'The Perfect Speech Opening',
              publishDate: '2025-02-01',
              slug: 'perfect-speech-opening',
              previewText: 'Captivate your audience from the first words you speak.',
              featuredImage: 'https://picsum.photos/800/452',
              tags: ['speech-structure', 'engagement']
            }
          ]
        };
        
        setLatestIssue(mockData.issues[0]);
        setArchiveIssues(mockData.issues.slice(1));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch newsletter data:', err);
        setError('Failed to load newsletter data. Please try again later.');
        toast({
          title: "Error Loading Newsletter",
          description: "There was a problem loading the newsletter content.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsletterData();
  }, [toast]);
  
  return { latestIssue, archiveIssues, isLoading, error };
}
