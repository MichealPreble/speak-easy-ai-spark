
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeechOccasion } from '@/types/speechOccasions';
import RelatedBlogPosts from './RelatedBlogPosts';

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

const OccasionDetails = ({
  occasion,
  favorites,
  setFavorites,
  blogPreviews,
  setBlogPreviews
}: OccasionDetailsProps) => {
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isFavorite = favorites.includes(occasion.name);

  const handleStartPractice = () => {
    trackEvent('speech_practice_started', 'Practice', `Started practice for ${occasion.name}`);
    navigate('/chat', { state: { occasion } });
  };

  const handleViewBlogPosts = () => {
    if (occasion.blogTag) {
      trackEvent('view_blog_posts', 'Practice', occasion.blogTag);
      navigate(`/blog?tag=${occasion.blogTag}`);
    }
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

    trackEvent(
      isFavorite ? 'remove_favorite' : 'save_favorite', 
      'Practice', 
      occasion.name
    );

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
        <p className="text-sm text-gray-600"><strong>Occasion:</strong> {occasion.occasion}</p>
        <p className="text-sm text-gray-600"><strong>Examples:</strong> {occasion.examples}</p>
        <p className="text-sm text-gray-600"><strong>Audience Size:</strong> {occasion.audienceSize}</p>
        <p className="text-sm text-gray-600"><strong>Task:</strong> {occasion.task}</p>
        
        <div className="mt-4 flex gap-4">
          <Button
            onClick={handleStartPractice}
            aria-label={`Start practicing for ${occasion.name}`}
          >
            Start Practicing
          </Button>
          {occasion.blogTag && (
            <Button
              variant="outline"
              onClick={handleViewBlogPosts}
              aria-label={`View blog posts for ${occasion.name}`}
            >
              View Related Blog Posts
            </Button>
          )}
          <Button
            variant={isFavorite ? 'destructive' : 'secondary'}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? `Remove ${occasion.name} from favorites` : `Add ${occasion.name} to favorites`}
          >
            {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
          </Button>
        </div>

        {blogPreviews.length > 0 && (
          <RelatedBlogPosts 
            posts={blogPreviews} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OccasionDetails;
