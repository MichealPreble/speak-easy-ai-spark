
export interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

export interface PracticeSession {
  id: string;
  occasion_name: string;
  session_date: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  progress: number;
  target: number;
  tip: string;
}
