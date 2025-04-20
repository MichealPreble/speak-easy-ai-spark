import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BlogPostPreview, Template, OccasionDetailsData } from '@/types/practiceTypes';

export function useOccasionDetailsData(occasionId: string): OccasionDetailsData {
  const [relatedPosts, setRelatedPosts] = useState<BlogPostPreview[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [practiceNote, setPracticeNote] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!occasionId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch related blog posts
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt')
          .eq('occasion_id', occasionId);
          
        if (postsError) throw new Error(postsError.message);
        
        if (postsData) {
          const typedPosts: BlogPostPreview[] = postsData.map((post: any) => ({
            id: String(post.id),
            title: String(post.title || ''),
            excerpt: String(post.excerpt || '')
          }));
          setRelatedPosts(typedPosts);
        }
        
        // Fetch speech templates
        const { data: templateData, error: templateError } = await supabase
          .from('speech_templates')
          .select('id, title, content')
          .eq('occasion_id', occasionId);
          
        if (templateError) throw new Error(templateError.message);
        
        if (templateData) {
          const typedTemplates: Template[] = templateData.map((template: any) => ({
            id: String(template.id),
            title: String(template.title || ''),
            content: String(template.content || '')
          }));
          setTemplates(typedTemplates);
        }
        
      } catch (err) {
        console.error('Error fetching occasion details:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [occasionId]);
  
  const handleFeedbackSubmit = async () => {
    // Feedback submission logic
  };

  const handleToggleFavorite = async () => {
    // Favorite toggle logic
  };

  return {
    relatedPosts,
    templates,
    isLoading,
    error,
    practiceNote,
    setPracticeNote,
    practiceFeedback,
    setPracticeFeedback,
    showFeedback,
    setShowFeedback,
    sessionId,
    setSessionId,
    handleFeedbackSubmit,
    handleToggleFavorite
  };
}
