
import { useRef, useEffect } from 'react';
import { getPitch, getVolume } from '@/utils/audioAnalysisUtils';

/**
 * Hook to track pitch and volume data from an audio stream
 */
export function useAudioAnalysis(
  isActive: boolean,
  analyserNode: AnalyserNode | null,
  audioContext: AudioContext | null
) {
  const pitchDataRef = useRef<number[]>([]);
  const volumeDataRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Start or stop analysis based on isActive state
  useEffect(() => {
    // Clear data when analysis starts
    if (isActive) {
      pitchDataRef.current = [];
      volumeDataRef.current = [];
    }

    // Start analysis if active and we have the necessary audio nodes
    if (isActive && analyserNode && audioContext) {
      const analyze = () => {
        if (!isActive || !analyserNode || !audioContext) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          return;
        }
        
        // Get current pitch and volume measurements
        const pitch = getPitch(analyserNode, audioContext);
        const volume = getVolume(analyserNode);
        
        // Only store valid measurements
        if (pitch > 50 && pitch < 400) pitchDataRef.current.push(pitch);
        if (volume > 0) volumeDataRef.current.push(volume);
        
        // Continue analysis loop
        animationFrameRef.current = requestAnimationFrame(analyze);
      };
      
      // Start the analysis loop
      analyze();
    }

    // Clean up animation frame on unmount or when isActive changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, analyserNode, audioContext]);

  // Calculate variation metrics
  const getAnalysisResults = () => {
    const pitchVariation = pitchDataRef.current.length > 0
      ? Math.max(...pitchDataRef.current) - Math.min(...pitchDataRef.current)
      : 0;
      
    const volumeVariation = volumeDataRef.current.length > 0
      ? Math.max(...volumeDataRef.current) - Math.min(...volumeDataRef.current)
      : 0;

    // Reset data after retrieving results
    pitchDataRef.current = [];
    volumeDataRef.current = [];
    
    return {
      pitchVariation: Math.round(pitchVariation),
      volumeVariation: Math.round(volumeVariation)
    };
  };

  return {
    getAnalysisResults
  };
}
