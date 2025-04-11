
import { useState, useEffect, useRef, useCallback } from 'react';
import { getPitch, getVolume } from '@/utils/audioAnalysisUtils';

/**
 * Hook for real-time audio analysis
 * Tracks pitch and volume from an audio analyzer node
 */
export function useAudioAnalysis(
  isActive: boolean,
  analyser: AnalyserNode | null,
  audioContext: AudioContext | null
) {
  const [pitchValues, setPitchValues] = useState<number[]>([]);
  const [volumeValues, setVolumeValues] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);
  
  // Add tracking for speaking patterns
  const [speakingPatterns, setSpeakingPatterns] = useState<{
    pauses: number[],
    sustainedSpeech: number[]
  }>({ pauses: [], sustainedSpeech: [] });
  
  // Last volume threshold time tracker
  const lastVolumeThresholdTime = useRef<number | null>(null);
  const isSpeakingRef = useRef<boolean>(false);
  
  const getAnalysisResults = useCallback(() => {
    const avgPitch = pitchValues.length 
      ? pitchValues.reduce((sum, val) => sum + val, 0) / pitchValues.length 
      : 0;
    
    const avgVolume = volumeValues.length 
      ? volumeValues.reduce((sum, val) => sum + val, 0) / volumeValues.length 
      : 0;
    
    // Calculate variation as max - min
    const pitchVariation = pitchValues.length > 1
      ? Math.max(...pitchValues) - Math.min(...pitchValues)
      : 0;
    
    const volumeVariation = volumeValues.length > 1
      ? Math.max(...volumeValues) - Math.min(...volumeValues)
      : 0;
    
    // Calculate speech rhythm metrics
    const pauseDurations = speakingPatterns.pauses.length > 1 
      ? speakingPatterns.pauses.reduce((sum, val) => sum + val, 0) / speakingPatterns.pauses.length
      : 0;
      
    const speechBurstDurations = speakingPatterns.sustainedSpeech.length > 1
      ? speakingPatterns.sustainedSpeech.reduce((sum, val) => sum + val, 0) / speakingPatterns.sustainedSpeech.length
      : 0;
    
    return {
      avgPitch,
      avgVolume,
      pitchVariation,
      volumeVariation,
      pauseDurations,
      speechBurstDurations,
      pitchValues: [...pitchValues],
      volumeValues: [...volumeValues]
    };
  }, [pitchValues, volumeValues, speakingPatterns]);
  
  // Set up and tear down audio analysis loop
  useEffect(() => {
    // Don't run analysis if inactive or missing dependencies
    if (!isActive || !analyser || !audioContext) {
      // Clear any existing animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    
    // Analysis loop
    const analyze = () => {
      if (!isActive || !analyser || !audioContext) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return;
      }
      
      const pitch = getPitch(analyser, audioContext);
      const volume = getVolume(analyser);
      
      // Track speaking patterns
      const now = Date.now();
      const VOLUME_THRESHOLD = 10; // Adjust based on testing
      
      if (volume > VOLUME_THRESHOLD) {
        // Person is speaking
        if (!isSpeakingRef.current && lastVolumeThresholdTime.current) {
          // Transition from silence to speech
          const pauseDuration = now - lastVolumeThresholdTime.current;
          if (pauseDuration > 300) { // Ignore very short pauses
            setSpeakingPatterns(prev => ({
              ...prev,
              pauses: [...prev.pauses, pauseDuration]
            }));
          }
        }
        isSpeakingRef.current = true;
        lastVolumeThresholdTime.current = now;
      } else {
        // Person is not speaking
        if (isSpeakingRef.current && lastVolumeThresholdTime.current) {
          // Transition from speech to silence
          const speechDuration = now - lastVolumeThresholdTime.current;
          if (speechDuration > 300) { // Ignore very short speech bursts
            setSpeakingPatterns(prev => ({
              ...prev,
              sustainedSpeech: [...prev.sustainedSpeech, speechDuration]
            }));
          }
        }
        isSpeakingRef.current = false;
        lastVolumeThresholdTime.current = now;
      }
      
      // Only store valid values
      if (pitch > 20 && pitch < 1000) { // Filter out unlikely pitch values
        setPitchValues(prev => {
          const newValues = [...prev, pitch];
          // Keep last 100 values to limit memory usage
          return newValues.slice(-100);
        });
      }
      
      if (volume > 0) {
        setVolumeValues(prev => {
          const newValues = [...prev, volume];
          // Keep last 100 values to limit memory usage
          return newValues.slice(-100);
        });
      }
      
      // Continue the loop
      rafRef.current = requestAnimationFrame(analyze);
    };
    
    // Start the analysis loop
    analyze();
    
    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, analyser, audioContext]);
  
  // Reset stored values when analysis stops
  useEffect(() => {
    if (!isActive) {
      setPitchValues([]);
      setVolumeValues([]);
      setSpeakingPatterns({ pauses: [], sustainedSpeech: [] });
    }
  }, [isActive]);
  
  return { getAnalysisResults };
}
