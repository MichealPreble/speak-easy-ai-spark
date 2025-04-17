
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Interfaces for the newsletter data
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

  // Mock data for development - this would be replaced with actual API calls
  useEffect(() => {
    const fetchNewsletterData = async () => {
      setIsLoading(true);
      
      try {
        // This is where you would call the Beehiiv API
        // const response = await fetch('https://api.beehiiv.com/v2/posts?publication_id=pub_459544e2-b4ac-473d-b735-38470ab16e0c', {
        //   headers: {
        //     'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        
        // For now, let's use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
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
        setArchiveIssues(mockData.issues);
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
