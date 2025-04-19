
import { useState, useEffect, useRef } from 'react';

export function useSpeakingPatterns(isActive: boolean, volume: number) {
  const [speakingPatterns, setSpeakingPatterns] = useState<{
    pauses: number[];
    sustainedSpeech: number[];
  }>({ pauses: [], sustainedSpeech: [] });
  
  const lastVolumeThresholdTime = useRef<number | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isActive) {
      setSpeakingPatterns({ pauses: [], sustainedSpeech: [] });
      return;
    }

    const now = Date.now();
    const VOLUME_THRESHOLD = 10;

    if (volume > VOLUME_THRESHOLD) {
      if (!isSpeakingRef.current && lastVolumeThresholdTime.current) {
        const pauseDuration = now - lastVolumeThresholdTime.current;
        if (pauseDuration > 300) {
          setSpeakingPatterns(prev => ({
            ...prev,
            pauses: [...prev.pauses, pauseDuration]
          }));
        }
      }
      isSpeakingRef.current = true;
      lastVolumeThresholdTime.current = now;
    } else {
      if (isSpeakingRef.current && lastVolumeThresholdTime.current) {
        const speechDuration = now - lastVolumeThresholdTime.current;
        if (speechDuration > 300) {
          setSpeakingPatterns(prev => ({
            ...prev,
            sustainedSpeech: [...prev.sustainedSpeech, speechDuration]
          }));
        }
      }
      isSpeakingRef.current = false;
      lastVolumeThresholdTime.current = now;
    }
  }, [isActive, volume]);

  return speakingPatterns;
}
