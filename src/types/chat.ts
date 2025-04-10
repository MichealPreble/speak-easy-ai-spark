
export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoiceMessage?: boolean;
  isFeedback?: boolean;
  read?: boolean;
};

export const ACCESSIBILITY_COLORS = {
  HIGH_CONTRAST_TEXT: 'text-gray-900 dark:text-gray-100',
};
