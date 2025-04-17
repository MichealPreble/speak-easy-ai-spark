
import { SpeechOccasion } from '@/types/speechOccasions';

export interface Template {
  id: string;
  title: string;
  content: string;
}

export interface OccasionDetailsProps {
  occasion: SpeechOccasion;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  blogPreviews: BlogPostPreview[];
  setBlogPreviews: React.Dispatch<React.SetStateAction<BlogPostPreview[]>>;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}
