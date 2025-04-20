
export type Milestone = {
  id: string;
  label: string;
  title?: string;
  description?: string;
  completed?: boolean;
  achieved?: boolean;
  progress?: number;
  target?: number;
  tip?: string;
}

export type SpeechOccasion = 'interview' | 'presentation' | 'toast' | 'pitch';

export type NewsletterIssue = {
  id: string;
  title: string;
  date: string;
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
  excerpt?: string;
  publishedAt: string;
}

export type Template = {
  id: string;
  title: string;
  body: string;
  content?: string;
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
}

export type PracticeSession = {
  id: string;
  userId: string;
  occasionName: string;
  occasion_name?: string;
  transcript: string;
  notes?: string;
  createdAt: string;
  session_date?: string;
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

export type CarouselInstance = ReturnType<typeof import('embla-carousel-react').useEmblaCarousel>[0];

export interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
