import { SpeechOccasion } from '@/types/speechOccasions';

export interface Milestone {
  id: string;
  label: string;
  title: string;
  description: string;
  achieved: boolean;
  progress: number;
  target: number;
  tip: string;
  completed: boolean;
}

export interface Template {
  id: string;
  title: string;
  body?: string;
  content: string;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  excerpt: string;
}

export interface PracticeSession {
  id: string;
  occasionName: string;
  date: string;
  duration: number;
  score?: number;
  notes?: string;
  transcript?: string;
  userId?: string;
  createdAt?: string;
}

export interface PracticeStats {
  totalSessions: number;
  uniqueOccasions: number;
  totalHours: number;
  notesAdded: number;
}

export interface PracticePageData {
  selectedOccasion: SpeechOccasion | null;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  blogPreviews: BlogPostPreview[];
  setBlogPreviews: (previews: BlogPostPreview[]) => void;
  totalSessions: number;
  uniqueOccasions: number;
  totalMinutes: number;
  notesAdded: number;
  milestones: Milestone[];
  recentOccasions: SpeechOccasion[];
  practiceSessions: PracticeSession[];
  userId: string | null;
  shareUrl: string;
  handleSelect: (occasion: SpeechOccasion) => void;
  handleSelectSession: (sessionId: string) => void;
}

export interface NewsletterIssue {
  id: string;
  title: string;
  date: string;
  slug: string;
  preview_text: string;
  published_at: string;
  content: string;
  featured_image?: string;
  blogTag?: string;
}

export interface OccasionDetailsData {
  id: string;
  title: string;
  rating: number;
  feedback: string;
  relatedPosts: BlogPostPreview[];
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  practiceNote: string;
  setPracticeNote: (note: string) => void;
  practiceFeedback: string;
  setPracticeFeedback: (feedback: string) => void;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  handleFeedbackSubmit: () => Promise<void>;
  handleToggleFavorite: () => Promise<void>;
}
