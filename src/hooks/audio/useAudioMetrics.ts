
import { useState, useEffect, useRef } from 'react';
import { getPitch, getVolume } from '@/utils/audioAnalysisUtils';

export function useAudioMetrics(
  isActive: boolean,
  analyser: AnalyserNode | null,
  audioContext: AudioContext | null
) {
  const [pitchValues, setPitchValues] = useState<number[]>([]);
  const [volumeValues, setVolumeValues] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !analyser || !audioContext) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const analyze = () => {
      const pitch = getPitch(analyser, audioContext);
      const volume = getVolume(analyser);
      
      if (pitch > 20 && pitch < 1000) {
        setPitchValues(prev => {
          const newValues = [...prev, pitch];
          return newValues.slice(-100);
        });
      }
      
      if (volume > 0) {
        setVolumeValues(prev => {
          const newValues = [...prev, volume];
          return newValues.slice(-100);
        });
      }
      
      rafRef.current = requestAnimationFrame(analyze);
    };
    
    analyze();
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, analyser, audioContext]);

  return {
    pitchValues,
    volumeValues
  };
}
