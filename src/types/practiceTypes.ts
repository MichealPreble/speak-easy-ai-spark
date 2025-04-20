
export interface PracticeSession {
  id: string;
  occasion_name: string;
  session_date: string;
  notes: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

export interface NewsletterIssue {
  id: string;
  title: string;
  slug: string;
  preview_text: string;
  published_at: string;
  content?: string;
}

export type SenderType = 'user' | 'bot';

export interface PracticeGoalType {
  id: string;
  goal_type: 'sessions' | 'occasions' | 'hours' | 'notes';
  target: number;
  deadline: string;
  progress: number;
}

export interface PracticePageData {
  selectedOccasion: string | null;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  blogPreviews: BlogPostPreview[];
  setBlogPreviews: (previews: BlogPostPreview[]) => void;
  totalSessions: number;
  uniqueOccasions: number;
  totalMinutes: number;
  notesAdded: number;
  milestones: string[];
  userId: string | null;
  shareUrl: string;
  handleSelect: (occasion: string) => void;
  handleSelectSession: (sessionId: string) => void;
}

export interface OccasionDetailsData {
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

