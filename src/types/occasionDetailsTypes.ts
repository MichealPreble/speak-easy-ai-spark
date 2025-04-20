
import { SpeechOccasion } from '@/types/speechOccasions';
import { BlogPostPreview as PracticeTypeBlogPostPreview } from '@/types/practiceTypes';

export interface Template {
  id: string;
  title: string;
  content: string;
}

export interface OccasionDetailsProps {
  occasion: SpeechOccasion;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  blogPreviews: PracticeTypeBlogPostPreview[];
  setBlogPreviews: React.Dispatch<React.SetStateAction<PracticeTypeBlogPostPreview[]>>;
}

// Re-export BlogPostPreview from practiceTypes to ensure consistent usage
export type BlogPostPreview = PracticeTypeBlogPostPreview;
