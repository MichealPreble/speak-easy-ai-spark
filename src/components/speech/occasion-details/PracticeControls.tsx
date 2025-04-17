
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  onFavoriteToggle
}) => {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const handleStartPractice = () => {
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
      <div className="flex flex-wrap gap-4">
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
