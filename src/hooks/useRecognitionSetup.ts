import { useRef, useState, useEffect, useCallback } from "react";
import { isSpeechRecognitionSupported, getSpeechErrorMessage } from "@/utils/speechRecognitionTypes";
import { useToast } from "@/hooks/use-toast";

export function useRecognitionSetup() {
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean | null>(null);

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

        // Check for permission status if possible
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'microphone' as PermissionName })
            .then(permissionStatus => {
              setIsPermissionGranted(permissionStatus.state === 'granted');
              
              permissionStatus.onchange = () => {
                setIsPermissionGranted(permissionStatus.state === 'granted');
              };
            })
            .catch(() => {
              // Some browsers don't support permission query for microphone
              setIsPermissionGranted(null);
            });
        }
      } else {
        toast({
          title: "Browser Compatibility Issue",
          description: "Your browser doesn't fully support voice recognition. For best results, use Chrome or Edge.",
          variant: "default",
          duration: 6000
        });
      }
    }
  }, [toast]);

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
      
      // Special handling for permission errors
      if (event.error === 'not-allowed') {
        setIsPermissionGranted(false);
      }
      
      toast({
        title: "Voice recognition error",
        description: errorMessage,
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      const noResultsTimeout = 500; // ms
      setTimeout(() => {
        const speechDuration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
        
        if (speechDuration < 1) {
          toast({
            title: "No speech detected",
            description: "Please try again and speak clearly into your microphone.",
            variant: "default"
          });
        }
      }, noResultsTimeout);
    };
  }, [toast]);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    if (!isBrowserSupported) return false;
    
    try {
      // The most reliable way to check microphone permission is to actually request it
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Clean up the stream immediately - we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      
      setIsPermissionGranted(true);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setIsPermissionGranted(false);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access in your browser settings to use voice features.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Microphone error",
          description: "Could not access your microphone. Please check your device settings.",
          variant: "destructive"
        });
      }
      return false;
    }
  }, [isBrowserSupported, toast]);

  return {
    recognitionRef,
    startTimeRef,
    isBrowserSupported,
    isPermissionGranted,
    setupRecognitionHandlers,
    checkPermission
  };
}
