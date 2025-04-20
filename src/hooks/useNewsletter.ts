
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsletterIssue } from '@/types/practiceTypes';

export function useNewsletter() {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [latestIssue, setLatestIssue] = useState<NewsletterIssue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletterIssues();
  }, []);

  const fetchNewsletterIssues = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('newsletter_issues')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        const typedIssues: NewsletterIssue[] = data.map((issue: any) => ({
          id: String(issue.id),
          title: String(issue.title || ''),
          slug: String(issue.slug || ''),
          preview_text: String(issue.preview_text || ''),
          published_at: String(issue.published_at || ''),
          content: issue.content ? String(issue.content) : undefined
        }));
        
        setIssues(typedIssues);
        setLatestIssue(typedIssues[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching newsletter issues');
      console.error('Error fetching newsletter issues:', err);
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

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        return {
          id: String(data.id),
          title: String(data.title || ''),
          slug: String(data.slug || ''),
          preview_text: String(data.preview_text || ''),
          published_at: String(data.published_at || ''),
          content: data.content ? String(data.content) : undefined
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
      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // PostgreSQL unique constraint violation
          return { success: true, message: 'You are already subscribed!' };
        }
        throw new Error(error.message);
      }

      return { success: true, message: 'Successfully subscribed to the newsletter!' };
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      return { 
        success: false, 
        message: err instanceof Error 
          ? `Error: ${err.message}` 
          : 'An error occurred during subscription.'
      };
    }
  };

  return {
    issues,
    latestIssue,
    isLoading,
    error,
    fetchNewsletterIssues,
    getIssueBySlug,
    subscribeToNewsletter
  };
}
