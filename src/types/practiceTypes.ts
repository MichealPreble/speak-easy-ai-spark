
export type Milestone = {
  id: string;
  label: string;
  title: string; // Required per PracticePageContent.tsx
  description?: string;
  completed?: boolean;
  achieved?: boolean;
  progress?: number;
  target?: number;
  tip: string; // Required per PracticePageContent.tsx
}

export type SpeechOccasion = 'interview' | 'presentation' | 'toast' | 'pitch';

export type NewsletterIssue = {
  id: string;
  title: string;
  date: string; // Required
  content: string;
  slug?: string;
  preview_text?: string;
  published_at?: string;
  featured_image?: string;
  blogTag?: string;
}

export type BlogPostPreview = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  excerpt?: string; // Optional to match occasionDetailsTypes
}

export type Template = {
  id: string;
  title: string;
  body: string; // Required per Template component
  content?: string; // Optional to support alternate pattern
}

export type OccasionDetailsData = {
  id: string;
  title: string;
  rating: number;
  feedback: string;
  relatedPosts?: BlogPostPreview[];
  templates?: Template[];
  isLoading?: boolean;
  error?: string | null;
  practiceNote?: string;
  practiceFeedback?: string;
  showFeedback?: boolean;
  sessionId?: string | null;
  // Required setters per OccasionDetails.tsx
  setPracticeNote?: (note: string) => void;
  setPracticeFeedback?: (feedback: string) => void;
  setShowFeedback?: (show: boolean) => void;
  setSessionId?: (id: string | null) => void;
  handleFeedbackSubmit?: () => void;
  handleToggleFavorite?: () => void;
}

export type PracticeSession = {
  id: string;
  userId: string;
  occasionName: string;
  occasion_name?: string; // Alternative field name
  transcript: string;
  notes?: string;
  createdAt: string;
  session_date?: string; // Alternative field name
}

export type PracticePageData = {
  selectedOccasion?: string | null;
  favorites?: string[];
  setFavorites?: React.Dispatch<React.SetStateAction<string[]>>;
  blogPreviews?: BlogPostPreview[];
  setBlogPreviews?: React.Dispatch<React.SetStateAction<BlogPostPreview[]>>;
  totalSessions?: number;
  uniqueOccasions?: number;
  totalMinutes?: number;
  notesAdded?: number;
  milestones: Milestone[];
  recentOccasions: SpeechOccasion[];
  practiceSessions: PracticeSession[];
  userId?: string | null;
  shareUrl?: string;
  handleSelect?: (occasion: string) => void;
  handleSelectSession?: (sessionId: string) => void;
}

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoiceMessage: boolean;
  isFeedback: boolean;
  read: boolean;
}

// Use proper import for embla-carousel-react
import { useEmblaCarousel } from 'embla-carousel-react';
export type CarouselInstance = ReturnType<typeof useEmblaCarousel>[0];

export interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
