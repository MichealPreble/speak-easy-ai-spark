
export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isVoiceMessage?: boolean;
  isFeedback?: boolean;
};

// Add new constants for accessibility
export const MINIMUM_TEXT_SIZE = {
  BODY: "text-base", // 16px minimum for body text
  SMALL: "text-sm",  // 14px for secondary text
};

// Color contrast values that meet WCAG AA standards
export const ACCESSIBILITY_COLORS = {
  HIGH_CONTRAST_TEXT: "text-gray-900 dark:text-gray-50", // For primary text on light/dark backgrounds
  MEDIUM_CONTRAST_TEXT: "text-gray-700 dark:text-gray-300", // For secondary text
  MUTED_TEXT: "text-gray-500 dark:text-gray-400", // For less important text
};
