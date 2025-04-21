
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOccasionDetailsData } from '@/hooks/useOccasionDetailsData';
import OccasionInfo from './occasion-details/OccasionInfo';
import PracticeControls from './occasion-details/PracticeControls';
import PracticeFeedback from './occasion-details/PracticeFeedback';
import TemplateSection from './occasion-details/TemplateSection';
import RelatedBlogPosts from './RelatedBlogPosts';
import { OccasionDetailsProps } from '@/types/occasionDetailsTypes';
import { Template, BlogPostPreview } from '@/types/practiceTypes';

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
  } = useOccasionDetailsData(occasion.name);

  const typedTemplates: Template[] = templates.map(t => ({
    id: t.id,
    title: t.title,
    body: t.body || '',
    content: t.content || ''
  }));

  const typedBlogPreviews: BlogPostPreview[] = blogPreviews.map(bp => ({
    id: bp.id,
    title: bp.title,
    summary: bp.summary,
    publishedAt: bp.publishedAt,
    excerpt: bp.excerpt || ''
  }));

  const onFavoriteToggle = () => {
    handleToggleFavorite();
  };

  const feedbackScore = parseInt(practiceFeedback, 10) || 0;

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
            practiceFeedback={feedbackScore}
            onFeedbackChange={(rating: number) => {
              setPracticeFeedback(rating.toString());
            }}
            onSubmit={handleFeedbackSubmit}
          />
        )}
        <TemplateSection
          templates={typedTemplates}
          occasionName={occasion.name}
        />
        <RelatedBlogPosts
          blogPreviews={typedBlogPreviews}
          blogTag={occasion.blogTag || ''}
        />
      </CardContent>
    </Card>
  );
};

export default OccasionDetails;
