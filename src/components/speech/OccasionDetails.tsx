
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpeechOccasion } from '@/types/speechOccasions';
import RelatedBlogPosts from './RelatedBlogPosts';

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

interface OccasionDetailsProps {
  occasion: SpeechOccasion;
  isFavorite: boolean;
  blogPreviews: BlogPostPreview[];
  onStartPractice: () => void;
  onViewBlogPosts: () => void;
  onToggleFavorite: () => void;
}

const OccasionDetails = ({
  occasion,
  isFavorite,
  blogPreviews,
  onStartPractice,
  onViewBlogPosts,
  onToggleFavorite,
}: OccasionDetailsProps) => {
  return (
    <div className="mt-6">
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
              onClick={onStartPractice}
              aria-label={`Start practicing for ${occasion.name}`}
            >
              Start Practicing
            </Button>
            {occasion.blogTag && (
              <Button
                variant="outline"
                onClick={onViewBlogPosts}
                aria-label={`View blog posts for ${occasion.name}`}
              >
                View Related Blog Posts
              </Button>
            )}
            <Button
              variant={isFavorite ? 'destructive' : 'secondary'}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? `Remove ${occasion.name} from favorites` : `Add ${occasion.name} to favorites`}
            >
              {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            </Button>
          </div>

          {blogPreviews.length > 0 && <RelatedBlogPosts posts={blogPreviews} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default OccasionDetails;
