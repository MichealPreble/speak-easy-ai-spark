
import { useCallback } from 'react';
import { useAudioMetrics } from './useAudioMetrics';
import { useSpeakingPatterns } from './useSpeakingPatterns';
import { useSpeechRate } from '../speech/useSpeechRate';

export function useAudioAnalysis(
  isActive: boolean,
  analyser: AnalyserNode | null,
  audioContext: AudioContext | null,
  transcript: string = ''
) {
  const { pitchValues, volumeValues } = useAudioMetrics(isActive, analyser, audioContext);
  const speakingPatterns = useSpeakingPatterns(isActive, volumeValues[volumeValues.length - 1] || 0);
  const { wpm } = useSpeechRate(transcript, isActive);

  const getAnalysisResults = useCallback(() => {
    const avgPitch = pitchValues.length 
      ? pitchValues.reduce((sum, val) => sum + val, 0) / pitchValues.length 
      : 0;
    
    const avgVolume = volumeValues.length 
      ? volumeValues.reduce((sum, val) => sum + val, 0) / volumeValues.length 
      : 0;
    
    const pitchVariation = pitchValues.length > 1
      ? Math.max(...pitchValues) - Math.min(...pitchValues)
      : 0;
    
    const volumeVariation = volumeValues.length > 1
      ? Math.max(...volumeValues) - Math.min(...volumeValues)
      : 0;
    
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
      volumeValues: [...volumeValues],
      wpm
    };
  }, [pitchValues, volumeValues, speakingPatterns, wpm]);
  
  return { getAnalysisResults };
}
