
export interface Milestone {
  id: string;
  label: string;
  title: string;
  description?: string;
  achieved?: boolean;
  progress?: number;
  target?: number;
}
