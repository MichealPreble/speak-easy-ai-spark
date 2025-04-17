
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSpeechRecognitionSupported } from "@/utils/speechRecognitionTypes";
import { useAudioSetup } from "@/hooks/useAudioSetup";
import { useRecognitionSetup } from "@/hooks/useRecognitionSetup";
import { useAudioAnalysis } from "@/hooks/useAudioAnalysis";
import { processTranscript } from "@/utils/speech/transcriptCore";
import { analyzeTextReadability } from "@/utils/speech/readabilityAnalysis";

export type SpeechFeedback = {
  speed: number;
  duration: number;
  fillerWords: string[];
  wordCount: number;
  pitchVariation: number;
  volumeVariation: number;
  volume: number;           // Average volume level (0-100)
  enunciation: number;      // Clarity of speech (0-100)
  readabilityScore: number; // Reading level score
  readabilityGrade: string; // Grade level (e.g., "8th Grade")
  complexWords: string[];   // List of complex words used
};

export function useVoiceRecognition(
  onVoiceMessage: (transcript: string, feedback: SpeechFeedback) => void
) {
  const { toast } = useToast();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTimeLimited, setIsTimeLimited] = useState(false);
  const MAX_RECORDING_SECONDS = 60; // 1 minute limit
  
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

  // Timer for recording duration
  useEffect(() => {
    let interval: number | null = null;
    
    if (isVoiceActive) {
      interval = window.setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          
          // Stop recording if time limit reached
          if (isTimeLimited && newDuration >= MAX_RECORDING_SECONDS) {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            return prev;
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVoiceActive, isTimeLimited, recognitionRef]);

  // Set up handlers when onVoiceMessage changes
  useEffect(() => {
    setupRecognitionHandlers((transcript, duration) => {
      const analysis = getAnalysisResults();
      const result = processTranscript(transcript, duration, analysis);
      
      // Add readability analysis
      const readabilityAnalysis = analyzeTextReadability(transcript);
      
      // Enhanced feedback with new metrics
      const enhancedFeedback: SpeechFeedback = {
        ...result.feedback,
        volume: analysis.avgVolume || 0,
        enunciation: calculateEnunciation(transcript, analysis),
        readabilityScore: readabilityAnalysis.score,
        readabilityGrade: readabilityAnalysis.gradeLevel,
        complexWords: readabilityAnalysis.complexWords,
      };
      
      // Pass processed transcript and enhanced feedback to callback
      onVoiceMessage(result.transcript, enhancedFeedback);
      
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

  // Calculate enunciation score based on various factors
  const calculateEnunciation = (transcript: string, analysis: any): number => {
    const words = transcript.split(/\s+/).filter(Boolean);
    
    // Basic enunciation factors
    const factors = {
      // Speech pauses and rhythm
      rhythmScore: analysis.pauseDurations ? Math.min(1, 1 - (analysis.pauseDurations / 1000)) : 0.5,
      
      // Word clarity
      consonantClusters: transcript.match(/[bcdfghjklmnpqrstvwxyz]{3,}/gi)?.length || 0,
      
      // Speech flow
      volumeConsistency: analysis.volumeVariation ? Math.min(1, 1 - (analysis.volumeVariation / 50)) : 0.5
    };
    
    // Calculate weighted score (0-100)
    const enunciationScore = (
      (factors.rhythmScore * 0.4) + 
      (Math.max(0, 0.8 - (factors.consonantClusters / words.length)) * 0.3) +
      (factors.volumeConsistency * 0.3)
    ) * 100;
    
    return Math.round(Math.max(0, Math.min(100, enunciationScore)));
  };

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

  const toggleVoice = useCallback(async (timeLimit = false) => {
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
        setIsTimeLimited(false);
      } catch (error) {
        toast({
          title: "Error stopping voice recognition",
          description: "Could not stop voice recognition properly.",
          variant: "destructive"
        });
        setIsVoiceActive(false);
        setIsTimeLimited(false);
      }
    } else {
      try {
        startTimeRef.current = Date.now();
        setIsTimeLimited(timeLimit);
        
        const audioSetupSuccess = await setupAudio();
        if (!audioSetupSuccess) {
          return;
        }
        
        recognitionRef.current.start();
        setIsVoiceActive(true);
        
        toast({
          title: timeLimit ? "1-Minute Speech Practice" : "Voice recognition active",
          description: timeLimit ? "Recording started (60 second limit)..." : "Speak now...",
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
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS
  };
}
