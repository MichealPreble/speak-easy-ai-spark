
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSpeechRecognitionSupported } from "@/utils/speechRecognitionTypes";
import { useAudioSetup } from "@/hooks/useAudioSetup";
import { useRecognitionSetup } from "@/hooks/useRecognitionSetup";
import { useAudioAnalysis } from "@/hooks/useAudioAnalysis";
import { processTranscript } from "@/utils/transcriptProcessing";

export type SpeechFeedback = {
  speed: number;
  duration: number;
  fillerWords: string[];
  wordCount: number;
  pitchVariation: number;
  volumeVariation: number;
};

export function useVoiceRecognition(
  onVoiceMessage: (transcript: string, feedback: SpeechFeedback) => void
) {
  const { toast } = useToast();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const {
    audioContextRef,
    analyserRef,
    streamRef,
    setupAudio,
    teardownAudio
  } = useAudioSetup();
  
  const {
    recognitionRef,
    startTimeRef,
    isBrowserSupported,
    setupRecognitionHandlers
  } = useRecognitionSetup();
  
  const { getAnalysisResults } = useAudioAnalysis(
    isVoiceActive, 
    analyserRef.current, 
    audioContextRef.current
  );

  // Set up handlers when onVoiceMessage changes
  useEffect(() => {
    setupRecognitionHandlers((transcript, duration) => {
      const analysis = getAnalysisResults();
      const result = processTranscript(transcript, duration, analysis);
      
      // Pass processed transcript and feedback to callback
      onVoiceMessage(result.transcript, result.feedback);
      
      // Clean up audio resources
      teardownAudio();
      setIsVoiceActive(false);
    });
    
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        setIsVoiceActive(false);
      };
    }
  }, [onVoiceMessage, setupRecognitionHandlers, getAnalysisResults, teardownAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isVoiceActive) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Silently handle cleanup errors
        }
      }
      
      teardownAudio();
    };
  }, [isVoiceActive, teardownAudio]);

  const toggleVoice = useCallback(async () => {
    if (!isBrowserSupported) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    if (isVoiceActive) {
      try {
        recognitionRef.current.stop();
        teardownAudio();
        setIsVoiceActive(false);
      } catch (error) {
        toast({
          title: "Error stopping voice recognition",
          description: "Could not stop voice recognition properly.",
          variant: "destructive"
        });
        setIsVoiceActive(false);
      }
    } else {
      try {
        startTimeRef.current = Date.now();
        
        const audioSetupSuccess = await setupAudio();
        if (!audioSetupSuccess) {
          return;
        }
        
        recognitionRef.current.start();
        setIsVoiceActive(true);
        
        toast({
          title: "Voice recognition active",
          description: "Speak now...",
        });
      } catch (error) {
        teardownAudio();
        
        toast({
          title: "Voice recognition error",
          description: "Could not start voice recognition. Please check your microphone access.",
          variant: "destructive"
        });
      }
    }
  }, [isVoiceActive, isBrowserSupported, recognitionRef, toast, teardownAudio, setupAudio]);

  return {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported
  };
}
