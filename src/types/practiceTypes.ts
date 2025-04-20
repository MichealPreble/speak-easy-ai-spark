
export interface Milestone {
  id: string;
  label: string;
  title: string;
  description: string; // Made non-optional to match the error
  achieved?: boolean;
  progress?: number;
  target?: number;
  tip?: string;
}
