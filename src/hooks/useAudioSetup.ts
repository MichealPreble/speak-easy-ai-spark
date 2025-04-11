
import { useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { setupAudioAnalysis, cleanupAudio } from "@/utils/audioAnalysisUtils";

export function useAudioSetup() {
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const setupAudio = useCallback(async () => {
    try {
      const audioSetup = await setupAudioAnalysis();
      if (!audioSetup.success) {
        throw new Error("Failed to set up audio analysis");
      }
      
      audioContextRef.current = audioSetup.audioContext;
      analyserRef.current = audioSetup.analyser;
      streamRef.current = audioSetup.stream;
      
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
  
  return {
    audioContextRef,
    analyserRef,
    streamRef,
    setupAudio,
    teardownAudio
  };
}
