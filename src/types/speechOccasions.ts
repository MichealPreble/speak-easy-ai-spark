
export interface SpeechOccasion {
  name: string;
  occasion: string;
  examples: string;
  audienceSize: string;
  audienceSizeCategory: 'Small' | 'Medium' | 'Large';
  frequency: 'Rare' | 'Regular';
  task: string;
  blogTag?: string;
}

export interface SpeechCategory {
  category: string;
  occasions: SpeechOccasion[];
}

export type SpeechOccasionsData = SpeechCategory[];
