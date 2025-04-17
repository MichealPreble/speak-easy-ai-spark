
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface PracticeControlsProps {
  occasionName: string;
  blogTag?: string;
  isFavorite: boolean;
  practiceNote: string;
  onPracticeNoteChange: (note: string) => void;
  onFavoriteToggle: () => void;
}

const PracticeControls: React.FC<PracticeControlsProps> = ({
  occasionName,
  blogTag,
  isFavorite,
  practiceNote,
  onPracticeNoteChange,
  onFavoriteToggle,
}) => {
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartPractice = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to start a practice session.',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .insert({ user_id: user.id, occasion_name: occasionName, notes: practiceNote || undefined })
      .select('id')
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save practice session.',
        variant: 'destructive',
      });
      return;
    }

    if (practiceNote) {
      trackEvent('add_practice_note', 'SpeechPractice', occasionName);
    }
    
    trackEvent('start_practice', 'SpeechPractice', occasionName);
    navigate('/chat', { state: { occasion: { name: occasionName } } });
  };

  const handleViewBlogPosts = () => {
    if (blogTag) {
      trackEvent('view_blog_posts', 'SpeechPractice', blogTag);
      navigate(`/blog?tag=${blogTag}`);
    }
  };

  return (
    <div className="mt-4">
      <Input
        placeholder="Add a note for this practice session (e.g., key points, feedback)"
        value={practiceNote}
        onChange={(e) => onPracticeNoteChange(e.target.value)}
        className="mb-4"
        aria-label="Practice session note"
      />
      <div className="flex gap-4">
        <Button
          onClick={handleStartPractice}
          aria-label={`Start practicing for ${occasionName}`}
        >
          Start Practicing
        </Button>
        {blogTag && (
          <Button
            variant="outline"
            onClick={handleViewBlogPosts}
            aria-label={`View blog posts for ${occasionName}`}
          >
            View Related Blog Posts
          </Button>
        )}
        <Button
          variant={isFavorite ? 'destructive' : 'secondary'}
          onClick={onFavoriteToggle}
          aria-label={isFavorite ? `Remove ${occasionName} from favorites` : `Add ${occasionName} to favorites`}
        >
          {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
        </Button>
      </div>
    </div>
  );
};

export default PracticeControls;
