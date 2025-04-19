
export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoiceMessage?: boolean;
  isFeedback?: boolean;
  read?: boolean;
};

export interface SpeechFeedback {
  speed: number;
  duration: number;
  fillerWords: string[];
  wordCount: number;
  pitchVariation: number;
  volumeVariation: number;
  volume: number;
  enunciation: number;
  readabilityScore: number;
  readabilityGrade: string;
  complexWords?: string[];
}

export const ACCESSIBILITY_COLORS = {
  HIGH_CONTRAST_TEXT: 'text-gray-900 dark:text-gray-100',
};

