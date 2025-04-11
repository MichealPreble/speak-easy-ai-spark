
import { useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { setupAudioAnalysis, cleanupAudio } from "@/utils/audioAnalysisUtils";

export function useAudioSetup() {
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const connectionAttempts = useRef<number>(0);
  
  const setupAudio = useCallback(async () => {
    try {
      // Attempt to recover from previously failed attempts
      if (connectionAttempts.current > 2) {
        toast({
          title: "Microphone access issues",
          description: "We're having trouble accessing your microphone. Please check your browser permissions.",
          variant: "destructive"
        });
      }
      
      connectionAttempts.current += 1;
      
      const audioSetup = await setupAudioAnalysis();
      if (!audioSetup.success) {
        throw new Error("Failed to set up audio analysis");
      }
      
      audioContextRef.current = audioSetup.audioContext;
      analyserRef.current = audioSetup.analyser;
      streamRef.current = audioSetup.stream;
      
      // Reset connection attempts counter on success
      connectionAttempts.current = 0;
      
      return true;
    } catch (error) {
      toast({
        title: "Voice recognition error",
        description: "Could not start voice recognition. Please check your microphone access.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);
  
  const teardownAudio = useCallback(() => {
    cleanupAudio(streamRef.current, audioContextRef.current);
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);
  
  // Check if browser supports audio processing
  const isAudioSupported = useCallback(() => {
    return typeof window !== 'undefined' && 
           typeof window.AudioContext !== 'undefined' && 
           navigator.mediaDevices && 
           typeof navigator.mediaDevices.getUserMedia === 'function';
  }, []);
  
  return {
    audioContextRef,
    analyserRef,
    streamRef,
    setupAudio,
    teardownAudio,
    isAudioSupported
  };
}
