
export interface Milestone {
  id: string;
  label: string;
  title: string;
  description?: string;
  achieved?: boolean;
  progress?: number;
  target?: number;
  tip?: string;
}

export interface NewsletterIssue {
  id: string;
  title: string;
  slug: string;
  preview_text: string;
  published_at: string;
  content?: string;
  featured_image?: string;
  blogTag?: string;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

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
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  blogPreviews: BlogPostPreview[];
  setBlogPreviews: React.Dispatch<React.SetStateAction<BlogPostPreview[]>>;
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
  setPracticeNote: React.Dispatch<React.SetStateAction<string>>;
  practiceFeedback: string;
  setPracticeFeedback: React.Dispatch<React.SetStateAction<string>>;
  showFeedback: boolean;
  setShowFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  handleFeedbackSubmit: () => Promise<void>;
  handleToggleFavorite: () => Promise<void>;
}
