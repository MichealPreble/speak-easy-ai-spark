import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeechOccasion } from '@/types/speechOccasions';
import { Template, OccasionDetailsProps } from '@/types/occasionDetailsTypes';

export const useOccasionDetailsData = (
  occasion: SpeechOccasion, 
  setBlogPreviews: OccasionDetailsProps['setBlogPreviews']
) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [practiceNote, setPracticeNote] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (occasion.blogTag) {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt')
          .eq('tag', occasion.blogTag)
          .limit(2);
        setBlogPreviews(data || []);
      }
      
      const { data } = await supabase
        .from('templates')
        .select('id, title, content')
        .eq('occasion_name', occasion.name);
      
      setTemplates(data || []);
      
      if (data && data.length > 0) {
        trackEvent('view_template', 'SpeechPractice', occasion.name);
      }
    };
    
    fetchData();
  }, [occasion, setBlogPreviews, trackEvent]);

  const handleFeedbackSubmit = async () => {
    if (!sessionId || practiceFeedback === null) return;

    const { error } = await supabase
      .from('practice_sessions')
      .update({ practice_feedback: practiceFeedback })
      .eq('id', sessionId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save feedback.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Feedback Saved',
      description: `You rated this session ${practiceFeedback} star${practiceFeedback > 1 ? 's' : ''}.`,
    });
    trackEvent('submit_practice_feedback', 'SpeechPractice', `${occasion.name}:${practiceFeedback}`);
    setShowFeedback(false);
    setPracticeFeedback(null);
    setSessionId(null);
  };

  const handleToggleFavorite = async (
    favorites: string[], 
    setFavorites: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save favorites.',
        variant: 'destructive',
      });
      return;
    }

    const isFavorite = favorites.includes(occasion.name);
    trackEvent(isFavorite ? 'remove_favorite' : 'save_favorite', 'SpeechPractice', occasion.name);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('occasion_name', occasion.name);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to remove favorite.',
          variant: 'destructive',
        });
        return;
      }
      setFavorites(favorites.filter((name) => name !== occasion.name));
      toast({
        title: 'Removed from Favorites',
        description: `${occasion.name} removed from your favorites.`,
      });
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, occasion_name: occasion.name });
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to save favorite.',
          variant: 'destructive',
        });
        return;
      }
      setFavorites([...favorites, occasion.name]);
      toast({
        title: 'Added to Favorites',
        description: `${occasion.name} added to your favorites.`,
      });
    }
  };

  return {
    templates,
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
};
