
import { useRef, useState, useEffect, useCallback } from "react";
import { isSpeechRecognitionSupported, getSpeechErrorMessage } from "@/utils/speechRecognitionTypes";
import { useToast } from "@/hooks/use-toast";

export function useRecognitionSetup() {
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSupported = isSpeechRecognitionSupported();
      setIsBrowserSupported(isSupported);
      
      if (isSupported) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
      }
    }
  }, []);

  const setupRecognitionHandlers = useCallback((
    onTranscriptReceived: (transcript: string, duration: number) => void
  ) => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: any) => {
      try {
        const transcript = event.results[0][0].transcript;
        const endTime = Date.now();
        const duration = startTimeRef.current ? (endTime - startTimeRef.current) / 1000 : 0;
        
        onTranscriptReceived(transcript, duration);
      } catch (error) {
        toast({
          title: "Speech processing error",
          description: "There was an error processing your speech. Please try again.",
          variant: "destructive"
        });
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      const errorMessage = getSpeechErrorMessage(event.error);
      toast({
        title: "Voice recognition error",
        description: errorMessage,
        variant: "destructive"
      });
    };
  }, [toast]);

  return {
    recognitionRef,
    startTimeRef,
    isBrowserSupported,
    setupRecognitionHandlers
  };
}
