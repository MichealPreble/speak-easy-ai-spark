
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface NewsletterIssue {
  id: string;
  title: string;
  slug: string;
  preview_text: string;
  published_at: string;
  featured_image?: string;
  content?: string;
  blogTag?: string;
}

interface UseNewsletterProps {
  publicationId?: string;
  slug?: string;
  page?: number;
  limit?: number;
  blogTag?: string;
  searchQuery?: string;
}

export function useNewsletter({
  publicationId = 'pub_459544e2-b4ac-473d-b735-38470ab16e0c',
  slug,
  page = 1,
  limit = 10,
  blogTag,
  searchQuery,
}: UseNewsletterProps = {}) {
  const [latestIssue, setLatestIssue] = useState<NewsletterIssue | null>(null);
  const [archiveIssues, setArchiveIssues] = useState<NewsletterIssue[]>([]);
  const [singleIssue, setSingleIssue] = useState<NewsletterIssue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (slug) return;
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('newsletter_issues')
          .select('id, title, slug, preview_text, published_at, featured_image, blogTag')
          .order('published_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1);

        if (blogTag) {
          query = query.eq('blogTag', blogTag);
          trackEvent('filter_archive', 'Newsletter', `Filter by ${blogTag}`);
        }
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
          trackEvent('search_archive', 'Newsletter', `Search: ${searchQuery}`);
        }

        const { data, error: dbError } = await query;
        if (dbError) throw dbError;

        const posts = data as NewsletterIssue[] || [];
        if (posts.length > 0) {
          setLatestIssue(posts[0]);
          setArchiveIssues(posts.slice(1));
          trackEvent('view_newsletter', 'Newsletter', 'Latest Issue Loaded');
        }
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
    
    fetchIssues();
  }, [page, limit, blogTag, searchQuery, trackEvent, slug, toast]);

  // Fetch single issue when slug is provided
  useEffect(() => {
    if (!slug) return;
    const fetchSingleIssue = async () => {
      setIsLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('newsletter_issues')
          .select('*')
          .eq('slug', slug)
          .single();

        if (dbError) throw dbError;
        
        if (data) {
          setSingleIssue(data as NewsletterIssue);
          trackEvent('view_newsletter_issue', 'Newsletter', data.title);
        }
      } catch (err) {
        console.error('Failed to fetch single issue:', err);
        setError('Failed to load the newsletter issue. Please try again later.');
        toast({
          title: "Error Loading Issue",
          description: "There was a problem loading this newsletter issue.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleIssue();
  }, [slug, trackEvent, toast]);

  return { latestIssue, archiveIssues, singleIssue, isLoading, error };
}
