
import { useRef, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { setupAudioAnalysis, cleanupAudio } from "@/utils/audioAnalysisUtils";
import { useAudioAnalysis } from "@/hooks/useAudioAnalysis";

declare global {
  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
          confidence: number;
        };
      };
      item(index: number): any;
      length: number;
    };
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

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
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { getAnalysisResults } = useAudioAnalysis(
    isVoiceActive, 
    analyserRef.current, 
    audioContextRef.current
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
            const duration = startTimeRef.current ? (endTime - startTimeRef.current) / 1000 : 0;
            const wordCount = transcript.split(/\s+/).filter(Boolean).length;
            const speed = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
            const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well)\b/gi;
            const matches = transcript.match(fillerWordRegex);
            const fillerWords: string[] = matches ? matches.map(word => word.toLowerCase()) : [];

            const analysis = getAnalysisResults();

            const feedback: SpeechFeedback = {
              speed,
              duration: Math.round(duration),
              fillerWords: [...new Set(fillerWords)],
              wordCount,
              pitchVariation: Math.round(analysis.pitchVariation),
              volumeVariation: Math.round(analysis.volumeVariation),
            };

            onVoiceMessage(transcript, feedback);

            cleanupAudio(streamRef.current, audioContextRef.current);
            streamRef.current = null;
            audioContextRef.current = null;
            analyserRef.current = null;
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
          if (event.error === 'no-speech') {
            errorMessage = "No speech detected. Please try again.";
          } else if (event.error === 'audio-capture') {
            errorMessage = "No microphone detected. Please check your microphone settings.";
          } else if (event.error === 'not-allowed') {
            errorMessage = "Microphone access denied. Please allow microphone access.";
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
      if (recognitionRef.current && isVoiceActive) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Silently handle cleanup errors
        }
      }
      
      cleanupAudio(streamRef.current, audioContextRef.current);
    };
  }, [onVoiceMessage, toast, getAnalysisResults]);

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
        cleanupAudio(streamRef.current, audioContextRef.current);
        streamRef.current = null;
        audioContextRef.current = null;
        analyserRef.current = null;
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
        
        const audioSetup = await setupAudioAnalysis();
        if (!audioSetup.success) {
          throw new Error("Failed to set up audio analysis");
        }
        
        audioContextRef.current = audioSetup.audioContext;
        analyserRef.current = audioSetup.analyser;
        streamRef.current = audioSetup.stream;
        
        recognitionRef.current.start();
        setIsVoiceActive(true);
        
        toast({
          title: "Voice recognition active",
          description: "Speak now...",
        });
      } catch (error) {
        cleanupAudio(streamRef.current, audioContextRef.current);
        streamRef.current = null;
        audioContextRef.current = null;
        analyserRef.current = null;
        
        toast({
          title: "Voice recognition error",
          description: "Could not start voice recognition. Please check your microphone access.",
          variant: "destructive"
        });
      }
    }
  }, [isVoiceActive, isBrowserSupported, toast]);

  return {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported
  };
}
