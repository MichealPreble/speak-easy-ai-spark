
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

/**
 * Check if the browser supports speech recognition
 * @returns boolean indicating if speech recognition is supported
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
};

/**
 * Get browser speech recognition support information
 * @returns Object containing support details and recommended browsers
 */
export const getSpeechSupportInfo = () => {
  const isSupported = isSpeechRecognitionSupported();
  
  const browsers = {
    chrome: { name: "Google Chrome", supported: true },
    edge: { name: "Microsoft Edge", supported: true },
    safari: { name: "Safari", supported: false },
    firefox: { name: "Firefox", supported: false },
    opera: { name: "Opera", supported: true },
    samsung: { name: "Samsung Internet", supported: true },
  };
  
  const recommendedBrowsers = Object.values(browsers)
    .filter(browser => browser.supported)
    .map(browser => browser.name);
  
  return {
    isSupported,
    recommendedBrowsers,
    message: isSupported
      ? "Your browser supports speech recognition."
      : `Your browser does not support speech recognition. Please use ${recommendedBrowsers.join(", ")}.`
  };
};

/**
 * Convert speech recognition error codes into user-friendly messages
 * @param error The error code from the speech recognition API
 * @returns User-friendly error message
 */
export const getSpeechErrorMessage = (error: string): string => {
  switch (error) {
    case 'no-speech':
      return "No speech detected. Please try again and speak clearly.";
    case 'audio-capture':
      return "No microphone detected. Please check your microphone settings.";
    case 'not-allowed':
      return "Microphone access denied. Please allow microphone access in your browser settings.";
    case 'network':
      return "Network error occurred. Please check your connection.";
    case 'aborted':
      return "Speech recognition was aborted.";
    case 'service-not-allowed':
      return "Speech recognition service not allowed on this domain.";
    case 'bad-grammar':
      return "Speech recognition encountered an issue with language processing.";
    case 'language-not-supported':
      return "The selected language is not supported for speech recognition.";
    default:
      return "Could not recognize speech. Please try again.";
  }
};
