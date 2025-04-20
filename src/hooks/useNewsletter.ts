
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsletterIssue } from '@/types/practiceTypes';

interface NewsletterOptions {
  page?: number;
  limit?: number;
  blogTag?: string;
  searchQuery?: string;
}

export function useNewsletter(options: NewsletterOptions = {}) {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [latestIssue, setLatestIssue] = useState<NewsletterIssue | null>(null);
  const [archiveIssues, setArchiveIssues] = useState<NewsletterIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchNewsletterIssues();
  }, []);

  const fetchNewsletterIssues = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('newsletter_issues')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const typedIssues: NewsletterIssue[] = data.map(issue => ({
          id: String(issue.id),
          title: String(issue.title || ''),
          slug: String(issue.slug || ''),
          preview_text: String(issue.preview_text || ''),
          published_at: String(issue.published_at || ''),
          content: issue.content ? String(issue.content) : undefined,
          featured_image: issue.featured_image ? String(issue.featured_image) : undefined,
          blogTag: issue.blog_tag ? String(issue.blog_tag) : undefined
        }));

        setIssues(typedIssues);
        setLatestIssue(typedIssues[0] || null);
        setArchiveIssues(typedIssues.slice(1));
      }
    } catch (err) {
      console.error('Error fetching newsletter issues:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch newsletter issues');
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueBySlug = async (slug: string): Promise<NewsletterIssue | null> => {
    try {
      const { data, error } = await supabase
        .from('newsletter_issues')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      if (data) {
        return {
          id: String(data.id),
          title: String(data.title || ''),
          slug: String(data.slug || ''),
          preview_text: String(data.preview_text || ''),
          published_at: String(data.published_at || ''),
          content: data.content ? String(data.content) : undefined,
          featured_image: data.featured_image ? String(data.featured_image) : undefined,
          blogTag: data.blog_tag ? String(data.blog_tag) : undefined
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching newsletter issue:', err);
      return null;
    }
  };

  const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          return { success: true, message: 'You are already subscribed!' };
        }
        throw error;
      }

      return { success: true, message: 'Successfully subscribed to the newsletter!' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to subscribe to newsletter'
      };
    }
  };

  return {
    issues,
    latestIssue,
    archiveIssues,
    isLoading,
    error,
    fetchNewsletterIssues,
    getIssueBySlug,
    subscribeToNewsletter
  };
}
