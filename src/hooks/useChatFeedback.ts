
import { useCallback } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";

/**
 * Hook for generating feedback based on speech analysis
 */
export function useChatFeedback() {
  // Generate feedback based on speech analysis - memoized to prevent unnecessary re-creation
  const generateSpeechFeedback = useCallback((feedback: SpeechFeedback): string => {
    const { speed, duration, fillerWords, wordCount, pitchVariation, volumeVariation } = feedback;
    
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
    
    // Pitch variation feedback
    if (pitchVariation !== undefined) {
      feedbackText += `• **Pitch variation**: ${pitchVariation} Hz\n`;
      if (pitchVariation < 50) {
        feedbackText += "  Your pitch variation is quite low, which can make your speech sound monotone. Try varying your pitch to emphasize key points and keep your audience engaged.\n\n";
      } else if (pitchVariation > 200) {
        feedbackText += "  Your pitch variation is quite high, which can be engaging but may sound exaggerated. Aim for a more balanced variation to maintain a natural tone.\n\n";
      } else {
        feedbackText += "  Your pitch variation is in a good range, adding expressiveness to your speech. Well done!\n\n";
      }
    }
    
    // Volume variation feedback
    if (volumeVariation !== undefined) {
      feedbackText += `• **Volume variation**: ${volumeVariation} dB\n`;
      if (volumeVariation < 10) {
        feedbackText += "  Your volume variation is low, which can make your speech sound flat. Try varying your volume to highlight important points and maintain audience interest.\n\n";
      } else if (volumeVariation > 50) {
        feedbackText += "  Your volume variation is quite high, which can be dynamic but may feel inconsistent. Aim for a more controlled variation to maintain clarity.\n\n";
      } else {
        feedbackText += "  Your volume variation is in a good range, adding dynamism to your speech. Well done!\n\n";
      }
    }
    
    // Overall feedback and tips
    feedbackText += "### Next Steps\n";
    if (fillerWords.length > 0) {
      feedbackText += "• Practice replacing filler words with pauses\n";
    }
    if (speed < 120 || speed > 180) {
      feedbackText += "• Work on varying your speaking pace for different parts of your speech\n";
    }
    if (pitchVariation !== undefined && pitchVariation < 50) {
      feedbackText += "• Practice varying your pitch for emphasis and engagement\n";
    }
    if (volumeVariation !== undefined && volumeVariation < 10) {
      feedbackText += "• Work on varying your volume to highlight important points\n";
    }
    feedbackText += "• Record yourself and listen for vocal variety\n";
    feedbackText += "• Practice with a timer to develop a sense for timing\n";
    
    return feedbackText;
  }, []);

  return {
    generateSpeechFeedback
  };
}
