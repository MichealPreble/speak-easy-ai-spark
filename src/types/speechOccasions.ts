
export interface SpeechOccasion {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  tips: string[];
}

export interface SpeechOccasionsData {
  [category: string]: SpeechOccasion[];
}

export interface SpeechOccasionCategory {
  category: string;
  occasions: SpeechOccasion[];
}

// Interface for speech occasions in the legacy format
export interface LegacySpeechOccasion {
  name: string;
  occasion: string;
  examples: string;
  audienceSize: string;
  audienceSizeCategory: "Small" | "Medium" | "Large";
  frequency: "Regular" | "Rare";
  task: string;
  blogTag?: string;
}

// Legacy category format for backward compatibility
export interface SpeechCategory {
  category: string;
  occasions: {
    name: string;
    occasion: string;
    examples: string;
    audienceSize: string;
    audienceSizeCategory: "Small" | "Medium" | "Large";
    frequency: "Regular" | "Rare";
    task: string;
    blogTag?: string;
  }[];
}
