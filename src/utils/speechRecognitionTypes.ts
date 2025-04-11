
/**
 * TypeScript declarations for Web Speech API
 * This helps provide proper typing for browsers that support speech recognition
 */

// These declarations are moved from useVoiceRecognition.ts to improve maintainability
declare global {
  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
          confidence: number;
        };
      };
      item(index: number): any;
      length: number;
    };
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

// Export helper to check browser support
export const isSpeechRecognitionSupported = (): boolean => {
  return !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
};

// Export error message helper
export const getSpeechErrorMessage = (error: string): string => {
  switch (error) {
    case 'no-speech':
      return "No speech detected. Please try again.";
    case 'audio-capture':
      return "No microphone detected. Please check your microphone settings.";
    case 'not-allowed':
      return "Microphone access denied. Please allow microphone access.";
    case 'network':
      return "Network error occurred. Please check your connection.";
    case 'aborted':
      return "Speech recognition was aborted.";
    case 'service-not-allowed':
      return "Speech recognition service not allowed.";
    default:
      return "Could not recognize speech. Please try again.";
  }
};
