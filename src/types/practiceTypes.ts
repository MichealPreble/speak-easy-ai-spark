
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
