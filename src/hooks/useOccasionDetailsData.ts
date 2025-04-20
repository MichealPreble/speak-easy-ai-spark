
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BlogPostPreview, Template } from '@/types/practiceTypes';

export function useOccasionDetailsData(occasionId: string) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPostPreview[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  
  return {
    relatedPosts,
    templates,
    isLoading,
    error
  };
}
