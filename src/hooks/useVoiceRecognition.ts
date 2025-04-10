
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { setupAudioAnalysis, cleanupAudio } from "@/utils/audioAnalysisUtils";
import { useAudioAnalysis } from "@/hooks/useAudioAnalysis";

export type SpeechFeedback = {
  speed: number;
  duration: number;
  fillerWords: string[];
  wordCount: number;
  pitchVariation?: number; // Measure of pitch variation (Hz)
  volumeVariation?: number; // Measure of volume variation (dB)
};

export function useVoiceRecognition(
  onVoiceMessage: (transcript: string, feedback: SpeechFeedback) => void
) {
  const { toast } = useToast();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Audio analysis refs for pitch and volume tracking
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Use our new audio analysis hook
  const { getAnalysisResults } = useAudioAnalysis(
    isVoiceActive, 
    analyserRef.current, 
    audioContextRef.current
  );

  // Initialize speech recognition if available
  useEffect(() => {
    // Fix the type error by using a proper type check
    if (typeof window !== 'undefined') {
      // @ts-ignore - Ignoring type check since webkitSpeechRecognition isn't in standard lib.d.ts
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsBrowserSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          try {
            const transcript = event.results[0][0].transcript;
            const endTime = Date.now();
            
            // Calculate speech metrics
            const duration = startTimeRef.current ? (endTime - startTimeRef.current) / 1000 : 0; // seconds
            const wordCount = transcript.split(/\s+/).filter(Boolean).length;
            const speed = duration > 0 ? Math.round((wordCount / duration) * 60) : 0; // Words per minute
            
            // Detect filler words - fix the TypeScript error with proper typing
            const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well)\b/gi;
            const matches = transcript.match(fillerWordRegex);
            // Ensure we have a string array even if match returns null
            const fillerWords: string[] = matches ? 
              matches.map(word => word.toLowerCase()) : 
              [];
            
            // Get pitch and volume variation from our audio analysis hook
            const { pitchVariation, volumeVariation } = getAnalysisResults();
            
            // Create feedback object
            const feedback: SpeechFeedback = {
              speed,
              duration: Math.round(duration),
              fillerWords: [...new Set(fillerWords)], // Remove duplicates
              wordCount,
              pitchVariation,
              volumeVariation
            };
            
            // Clean up audio context
            cleanupAudio(streamRef.current, audioContextRef.current);
            audioContextRef.current = null;
            streamRef.current = null;
            
            onVoiceMessage(transcript, feedback);
          } catch (error) {
            toast({
              title: "Speech processing error",
              description: "There was an error processing your speech. Please try again.",
              variant: "destructive"
            });
            setIsVoiceActive(false);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          let errorMessage = "Could not recognize speech. Please try again.";
          
          // Provide more specific error messages based on the error type
          if (event.error === 'no-speech') {
            errorMessage = "No speech was detected. Please try again and speak clearly.";
          } else if (event.error === 'aborted') {
            errorMessage = "Speech recognition was aborted.";
          } else if (event.error === 'audio-capture') {
            errorMessage = "No microphone was found or microphone access was denied.";
          } else if (event.error === 'network') {
            errorMessage = "Network error occurred. Please check your connection.";
          } else if (event.error === 'not-allowed') {
            errorMessage = "Microphone access was denied. Please allow microphone access in your browser settings.";
          } else if (event.error === 'service-not-allowed') {
            errorMessage = "Speech recognition service is not allowed. Please try a different browser.";
          }
          
          setIsVoiceActive(false);
          toast({
            title: "Voice recognition error",
            description: errorMessage,
            variant: "destructive"
          });
        };

        recognitionRef.current.onend = () => {
          setIsVoiceActive(false);
        };
      } else {
        setIsBrowserSupported(false);
      }
    }

    return () => {
      // Stop recognition if active when component unmounts
      if (recognitionRef.current && isVoiceActive) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Silently handle any errors during cleanup
        }
      }
      
      // Clean up audio context if it exists
      cleanupAudio(streamRef.current, audioContextRef.current);
    };
  }, [onVoiceMessage, toast]);

  const toggleVoice = async () => {
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
        setIsVoiceActive(false);
        
        // Clean up audio resources
        cleanupAudio(streamRef.current, audioContextRef.current);
        audioContextRef.current = null;
        streamRef.current = null;
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
        recognitionRef.current.start();
        setIsVoiceActive(true);
        
        // Set up Web Audio API for pitch and volume analysis
        const audioSetup = await setupAudioAnalysis();
        if (audioSetup.success) {
          audioContextRef.current = audioSetup.audioContext;
          analyserRef.current = audioSetup.analyser;
          streamRef.current = audioSetup.stream;
        }
        
        toast({
          title: "Voice recognition active",
          description: "Speak now...",
        });
      } catch (error) {
        toast({
          title: "Voice recognition error",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported
  };
}
