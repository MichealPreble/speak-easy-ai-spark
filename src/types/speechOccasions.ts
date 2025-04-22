
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
