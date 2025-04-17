
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOccasionDetailsData } from '@/hooks/useOccasionDetailsData';
import OccasionInfo from './occasion-details/OccasionInfo';
import PracticeControls from './occasion-details/PracticeControls';
import PracticeFeedback from './occasion-details/PracticeFeedback';
import TemplateSection from './occasion-details/TemplateSection';
import RelatedBlogPosts from './RelatedBlogPosts';
import { OccasionDetailsProps } from '@/types/occasionDetailsTypes';

const OccasionDetails: React.FC<OccasionDetailsProps> = ({
  occasion,
  favorites,
  setFavorites,
  blogPreviews,
  setBlogPreviews,
}) => {
  const {
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
  } = useOccasionDetailsData(occasion, setBlogPreviews);

  const onFavoriteToggle = () => handleToggleFavorite(favorites, setFavorites);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Selected: {occasion.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <OccasionInfo occasion={occasion} />
        <PracticeControls
          occasionName={occasion.name}
          blogTag={occasion.blogTag}
          isFavorite={favorites.includes(occasion.name)}
          practiceNote={practiceNote}
          onPracticeNoteChange={setPracticeNote}
          onFavoriteToggle={onFavoriteToggle}
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
