
export interface SpeechOccasion {
  name: string;
  occasion: string;
  examples: string;
  audienceSize: string;
  task: string;
}

export interface SpeechCategory {
  category: string;
  occasions: SpeechOccasion[];
}

export type SpeechOccasionsData = SpeechCategory[];
