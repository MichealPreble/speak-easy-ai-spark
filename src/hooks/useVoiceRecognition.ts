
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVoiceRecognition(onVoiceMessage: (transcript: string) => void) {
  const { toast } = useToast();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const recognitionRef = useRef<any>(null);

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
          onVoiceMessage(transcript);
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
