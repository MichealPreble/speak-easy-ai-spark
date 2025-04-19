
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SpeechFeedback } from "@/types/chat";
import { calculateEnunciation } from "@/utils/speech/enunciationUtils";

export function useVoiceFeedback(
  onTranscriptReceived: (transcript: string, feedback: SpeechFeedback) => void
) {
  const { toast } = useToast();

  const handleTranscriptWithFeedback = useCallback((
    transcript: string, 
    duration: number, 
    analysis: any
  ) => {
    if (transcript.trim()) {
      const enunciationScore = calculateEnunciation(transcript, analysis);

      const feedback: SpeechFeedback = {
        speed: analysis?.avgPitch || 0,
        duration,
        fillerWords: [],
        wordCount: transcript.split(/\s+/).filter(Boolean).length,
        pitchVariation: analysis?.pitchVariation || 0,
        volumeVariation: analysis?.volumeVariation || 0,
        volume: analysis?.avgVolume || 0,
        enunciation: enunciationScore,
        readabilityScore: 0,
        readabilityGrade: '',
        complexWords: []
      };

      onTranscriptReceived(transcript, feedback);
    }
  }, [onTranscriptReceived]);

  const showError = useCallback((message: string) => {
    toast({
      title: "Voice recognition error",
      description: message,
      variant: "destructive"
    });
  }, [toast]);

  return {
    handleTranscriptWithFeedback,
    showError
  };
}
