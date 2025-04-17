
import { useCallback, useEffect } from "react";
import { useVoiceRecognition, SpeechFeedback } from "@/hooks/useVoiceRecognition";

interface UseChatVoiceProps {
  generateResponse: (transcript: string, feedback?: SpeechFeedback) => void;
}

/**
 * Hook for voice recognition in chat
 */
export function useChatVoice({ generateResponse }: UseChatVoiceProps) {
  const {
    isVoiceActive,
    toggleVoice: _toggleVoice,
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS
  } = useVoiceRecognition((transcript, feedback) => {
    if (transcript.trim()) {
      generateResponse(transcript, feedback);
    }
  });

  const toggleVoice = useCallback((timeLimit = false) => {
    _toggleVoice(timeLimit);
  }, [_toggleVoice]);

  return {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS
  };
}
