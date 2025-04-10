
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const pitchDataRef = useRef<number[]>([]);
  const volumeDataRef = useRef<number[]>([]);

  // Function to estimate pitch from audio data
  const getPitch = (analyser: AnalyserNode, audioContext: AudioContext) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(dataArray);

    // Simple autocorrelation to estimate pitch
    let maxCorrelation = 0;
    let bestOffset = -1;
    for (let offset = 20; offset < bufferLength / 2; offset++) {
      let correlation = 0;
      for (let i = 0; i < bufferLength - offset; i++) {
        correlation += Math.abs(dataArray[i] - dataArray[i + offset]);
      }
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestOffset = offset;
      }
    }

    if (bestOffset > 0) {
      const sampleRate = audioContext.sampleRate;
      const pitch = sampleRate / bestOffset; // Hz
      return pitch;
    }
    return 0;
  };

  // Function to get volume level from audio data
  const getVolume = (analyser: AnalyserNode) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    return average; // Approximate dB level
  };

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
            
            // Calculate pitch and volume variation from collected data
            const pitchVariation = pitchDataRef.current.length > 0
              ? Math.max(...pitchDataRef.current) - Math.min(...pitchDataRef.current)
              : 0;
            const volumeVariation = volumeDataRef.current.length > 0
              ? Math.max(...volumeDataRef.current) - Math.min(...volumeDataRef.current)
              : 0;
            
            // Create feedback object
            const feedback: SpeechFeedback = {
              speed,
              duration: Math.round(duration),
              fillerWords: [...new Set(fillerWords)], // Remove duplicates
              wordCount,
              pitchVariation: Math.round(pitchVariation),
              volumeVariation: Math.round(volumeVariation)
            };
            
            // Clean up audio context
            if (audioContextRef.current) {
              audioContextRef.current.close().catch(() => {
                // Silently handle any audio context closing errors
              });
              audioContextRef.current = null;
            }
            
            // Reset data arrays
            pitchDataRef.current = [];
            volumeDataRef.current = [];
            
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
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {
          // Silently handle any audio context closing errors
        });
      }
    };
  }, [onVoiceMessage, toast]);

  const toggleVoice = () => {
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
        try {
          // @ts-ignore - AudioContext might not be available in all browsers
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 2048;
          
          // Request microphone access for audio analysis
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              if (audioContextRef.current && analyserRef.current) {
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                
                // Start analyzing audio data
                const analyze = () => {
                  if (!isVoiceActive || !audioContextRef.current || !analyserRef.current) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                  }
                  
                  const pitch = getPitch(analyserRef.current, audioContextRef.current);
                  const volume = getVolume(analyserRef.current);
                  
                  // Only store valid measurements
                  if (pitch > 50 && pitch < 400) pitchDataRef.current.push(pitch);
                  if (volume > 0) volumeDataRef.current.push(volume);
                  
                  // Continue analysis loop
                  requestAnimationFrame(analyze);
                };
                
                analyze();
              }
            })
            .catch(err => {
              console.error("Error accessing microphone for audio analysis:", err);
            });
        } catch (error) {
          console.error("Error setting up audio analysis:", error);
          // Continue with voice recognition even if audio analysis fails
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
