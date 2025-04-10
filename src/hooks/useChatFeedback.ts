
import { useCallback } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";

/**
 * Hook for generating feedback based on speech analysis
 */
export function useChatFeedback() {
  // Generate feedback based on speech analysis - memoized to prevent unnecessary re-creation
  const generateSpeechFeedback = useCallback((feedback: SpeechFeedback): string => {
    const { speed, duration, fillerWords, wordCount } = feedback;
    
    let feedbackText = "## Speech Analysis\n\n";
    
    // Speaking rate feedback
    if (speed > 0) {
      feedbackText += `• **Speaking rate**: ${speed} words per minute\n`;
      if (speed < 120) {
        feedbackText += "  You're speaking a bit slowly, which can be good for emphasis but might lose audience attention if maintained throughout. Consider varying your pace.\n\n";
      } else if (speed > 180) {
        feedbackText += "  You're speaking quite rapidly, which shows enthusiasm but might make it difficult for your audience to follow. Try slowing down for key points.\n\n";
      } else {
        feedbackText += "  Your speaking rate is in an ideal range for clear comprehension. Well done!\n\n";
      }
    }
    
    // Filler words feedback
    if (fillerWords.length > 0) {
      const fillerFrequency = fillerWords.length / (duration / 60); // Fillers per minute
      feedbackText += `• **Filler words**: ${fillerWords.join(", ")}\n`;
      if (fillerFrequency > 5) {
        feedbackText += "  You're using quite a few filler words, which can distract from your message. Practice replacing them with strategic pauses.\n\n";
      } else if (fillerFrequency > 0) {
        feedbackText += "  You have a few filler words, but they're not overly distracting. Being aware of them is the first step to reducing them.\n\n";
      }
    } else {
      feedbackText += "• **Filler words**: None detected! Excellent job avoiding filler words.\n\n";
    }
    
    // Duration feedback
    feedbackText += `• **Duration**: ${duration} seconds (${wordCount} words)\n`;
    if (duration < 10) {
      feedbackText += "  Your message was quite brief. For practicing a speech, try a longer segment to demonstrate your pacing and structure.\n\n";
    } else if (duration > 60) {
      feedbackText += "  You delivered a substantial message. Great job maintaining your flow for an extended period.\n\n";
    } else {
      feedbackText += "  Good length for a practice segment. You provided enough content to demonstrate your speaking style.\n\n";
    }
    
    // Overall feedback and tips
    feedbackText += "### Next Steps\n";
    if (fillerWords.length > 0) {
      feedbackText += "• Practice replacing filler words with pauses\n";
    }
    if (speed < 120 || speed > 180) {
      feedbackText += "• Work on varying your speaking pace for different parts of your speech\n";
    }
    feedbackText += "• Record yourself and listen for vocal variety\n";
    feedbackText += "• Practice with a timer to develop a sense for timing\n";
    
    return feedbackText;
  }, []);

  return {
    generateSpeechFeedback
  };
}
