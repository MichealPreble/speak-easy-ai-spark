
import { useCallback, useEffect } from "react";
import { useVoiceState } from "./voice/useVoiceState";
import { useVoiceFeedback } from "./voice/useVoiceFeedback";
import { useAudioSetup } from "./useAudioSetup";
import { useRecognitionSetup } from "./useRecognitionSetup";
import { useAudioAnalysis } from "./useAudioAnalysis";
import { SpeechFeedback } from "@/types/chat";

export type { SpeechFeedback };

export function useVoiceRecognition(
  onVoiceMessage: (transcript: string, feedback: SpeechFeedback) => void
) {
  const {
    isVoiceActive,
    setIsVoiceActive,
    recordingDuration,
    setRecordingDuration,
    isTimeLimited,
    setIsTimeLimited,
    resetState
  } = useVoiceState();

  const {
    handleTranscriptWithFeedback,
    showError
  } = useVoiceFeedback(onVoiceMessage);

  const {
    audioContextRef,
    analyserRef,
    streamRef,
    setupAudio,
    teardownAudio,
    isAudioSupported
  } = useAudioSetup();

  const {
    recognitionRef,
    startTimeRef,
    isBrowserSupported,
    isPermissionGranted,
    setupRecognitionHandlers,
    checkPermission
  } = useRecognitionSetup();

  const { getAnalysisResults } = useAudioAnalysis(
    isVoiceActive,
    analyserRef.current,
    audioContextRef.current
  );

  // Timer for recording duration
  useEffect(() => {
    let interval: number | null = null;
    const MAX_RECORDING_SECONDS = 60;

    if (isVoiceActive) {
      interval = window.setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          if (isTimeLimited && newDuration >= MAX_RECORDING_SECONDS) {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            return prev;
          }
          return newDuration;
        });
      }, 1000);
      
      // Add silent timeout detector (no speech detected for 10 seconds)
      const silenceTimeout = window.setTimeout(() => {
        if (isVoiceActive && recordingDuration > 10) {
          // We've been recording for over 10 seconds with potentially no speech
          const analysis = getAnalysisResults();
          // If very little audio activity detected, suggest to the user
          if (analysis.volumeValues.length === 0 || 
              (analysis.volumeValues.length > 0 && 
               analysis.volumeValues.reduce((sum, val) => sum + val, 0) / analysis.volumeValues.length < 5)) {
            showError("No speech detected. Please check your microphone and speak clearly.");
            teardownAudio();
            resetState();
          }
        }
      }, 10000);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
        clearTimeout(silenceTimeout);
      };
    } else {
      setRecordingDuration(0);
      return () => {};
    }
  }, [isVoiceActive, isTimeLimited, recognitionRef, recordingDuration, setRecordingDuration, getAnalysisResults, showError, teardownAudio, resetState]);

  // Set up recognition handlers
  useEffect(() => {
    setupRecognitionHandlers((transcript, duration) => {
      const analysis = getAnalysisResults();
      handleTranscriptWithFeedback(transcript, duration, analysis);
      teardownAudio();
      resetState();
    });
  }, [setupRecognitionHandlers, getAnalysisResults, handleTranscriptWithFeedback, teardownAudio, resetState]);

  const toggleVoice = useCallback(async (timeLimit = false) => {
    if (!isBrowserSupported) {
      showError("Your browser doesn't support voice recognition. Try Chrome or Edge for the best experience.");
      return;
    }

    if (isVoiceActive) {
      try {
        recognitionRef.current?.stop();
        teardownAudio();
        resetState();
      } catch (error) {
        showError("Could not stop voice recognition properly.");
        resetState();
      }
    } else {
      try {
        // Check permission first
        const hasPermission = await checkPermission();
        if (!hasPermission) return;
        
        startTimeRef.current = Date.now();
        setIsTimeLimited(timeLimit);
        
        const audioSetupSuccess = await setupAudio();
        if (!audioSetupSuccess) return;
        
        recognitionRef.current?.start();
        setIsVoiceActive(true);
      } catch (error) {
        teardownAudio();
        showError("Could not start voice recognition. Please check your microphone access.");
      }
    }
  }, [
    isBrowserSupported,
    isVoiceActive,
    recognitionRef,
    showError,
    teardownAudio,
    resetState,
    setupAudio,
    setIsVoiceActive,
    setIsTimeLimited,
    checkPermission
  ]);

  // Detect if this is a fully supported environment
  const isFullySupported = isBrowserSupported && isAudioSupported();
  
  return {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported,
    isPermissionGranted,
    isFullySupported,
    recordingDuration,
    MAX_RECORDING_SECONDS: 60
  };
}
