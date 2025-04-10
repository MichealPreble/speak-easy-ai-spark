
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type SpeechFeedback = {
  speed: number;
  duration: number;
  fillerWords: string[];
  wordCount: number;
};

export function useVoiceRecognition(
  onVoiceMessage: (transcript: string, feedback: SpeechFeedback) => void
) {
  const { toast } = useToast();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize speech recognition if available
  useEffect(() => {
    // Fix the type error by using a proper type check
    if (typeof window !== 'undefined') {
      // @ts-ignore - Ignoring type check since webkitSpeechRecognition isn't in standard lib.d.ts
      const SpeechRecognition = window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
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
          
          // Create feedback object
          const feedback: SpeechFeedback = {
            speed,
            duration: Math.round(duration),
            fillerWords: [...new Set(fillerWords)], // Remove duplicates
            wordCount
          };
          
          onVoiceMessage(transcript, feedback);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsVoiceActive(false);
          toast({
            title: "Voice recognition error",
            description: "Could not recognize speech. Please try again.",
          });
        };

        recognitionRef.current.onend = () => {
          setIsVoiceActive(false);
        };
      }
    }

    return () => {
      // Stop recognition if active when component unmounts
      if (recognitionRef.current && isVoiceActive) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceActive, onVoiceMessage, toast]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Try Chrome or Edge.",
      });
      return;
    }

    if (isVoiceActive) {
      recognitionRef.current.stop();
      setIsVoiceActive(false);
    } else {
      try {
        startTimeRef.current = Date.now();
        recognitionRef.current.start();
        setIsVoiceActive(true);
        toast({
          title: "Voice recognition active",
          description: "Speak now...",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Voice recognition error",
          description: "Could not start voice recognition. Please try again.",
        });
      }
    }
  };

  return {
    isVoiceActive,
    toggleVoice
  };
}
