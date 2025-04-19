
export const calculateEnunciation = (transcript: string, analysis: any): number => {
  const words = transcript.split(/\s+/).filter(Boolean);
    
  // Basic enunciation factors
  const factors = {
    // Speech pauses and rhythm
    rhythmScore: analysis.pauseDurations ? Math.min(1, 1 - (analysis.pauseDurations / 1000)) : 0.5,
    
    // Word clarity
    consonantClusters: transcript.match(/[bcdfghjklmnpqrstvwxyz]{3,}/gi)?.length || 0,
    
    // Speech flow
    volumeConsistency: analysis.volumeVariation ? Math.min(1, 1 - (analysis.volumeVariation / 50)) : 0.5
  };
  
  // Calculate weighted score (0-100)
  const enunciationScore = (
    (factors.rhythmScore * 0.4) + 
    (Math.max(0, 0.8 - (factors.consonantClusters / words.length)) * 0.3) +
    (factors.volumeConsistency * 0.3)
  ) * 100;
  
  return Math.round(Math.max(0, Math.min(100, enunciationScore)));
};
