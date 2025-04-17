
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/lib/supabase';
import { SpeechOccasion } from '@/types/speechOccasions';
import OccasionInfo from './occasion-details/OccasionInfo';
import PracticeControls from './occasion-details/PracticeControls';
import PracticeFeedback from './occasion-details/PracticeFeedback';
import TemplateSection from './occasion-details/TemplateSection';
import RelatedBlogPosts from './RelatedBlogPosts';

interface Template {
  id: string;
  title: string;
  content: string;
}

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

interface OccasionDetailsProps {
  occasion: SpeechOccasion;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  blogPreviews: BlogPostPreview[];
  setBlogPreviews: React.Dispatch<React.SetStateAction<BlogPostPreview[]>>;
}

const OccasionDetails: React.FC<OccasionDetailsProps> = ({
  occasion,
  favorites,
  setFavorites,
  blogPreviews,
  setBlogPreviews,
}) => {
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

  useEffect(() => {
    const saveRecent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from('recent_occasions')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1);
        if (existing && existing.length >= 5) {
          await supabase
            .from('recent_occasions')
            .delete()
            .eq('id', existing[0].id);
        }
        await supabase
          .from('recent_occasions')
          .upsert({ user_id: user.id, occasion_name: occasion.name });
      }
    };
    saveRecent();
    trackEvent('view_occasion_details', 'SpeechPractice', occasion.name);
  }, [occasion, trackEvent]);

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

  const handleToggleFavorite = async () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected: {occasion.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <OccasionInfo occasion={occasion} />
        <PracticeControls
          occasionName={occasion.name}
          blogTag={occasion.blogTag}
          isFavorite={favorites.includes(occasion.name)}
          practiceNote={practiceNote}
          onPracticeNoteChange={setPracticeNote}
          onFavoriteToggle={handleToggleFavorite}
        />
        {showFeedback && (
          <PracticeFeedback
            practiceFeedback={practiceFeedback}
            onFeedbackChange={setPracticeFeedback}
            onSubmit={handleFeedbackSubmit}
          />
        )}
        <TemplateSection
          templates={templates}
          occasionName={occasion.name}
        />
        <RelatedBlogPosts
          blogPreviews={blogPreviews}
          blogTag={occasion.blogTag || ''}
        />
      </CardContent>
    </Card>
  );
};

export default OccasionDetails;
