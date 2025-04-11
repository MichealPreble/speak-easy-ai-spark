
import { useMemo } from "react";
import { SpeechAnalysisResult } from "@/utils/speech/types";

export function useSpeechChartData(data: SpeechAnalysisResult[]) {
  // Process the data to add date labels and ensure all metrics are present
  const processedData = useMemo(() => {
    return data.map((item, index) => {
      const date = item.timestamp ? new Date(item.timestamp) : new Date();
      return {
        id: index,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clarityScore: item.clarity.score,
        clarityRating: item.clarity.rating,
        pace: item.pace,
        fillerWordCount: item.fillerWordCount,
        hesitationCount: item.hesitationCount,
        rhythmScore: item.rhythmScore,
        processingTimeMs: item.metrics?.processingTimeMs || 0,
        cacheHit: item.metrics?.cacheHit || false
      };
    });
  }, [data]);

  // Calculate statistical insights
  const insights = useMemo(() => {
    if (processedData.length === 0) return null;
    
    const avgClarity = processedData.reduce((sum, item) => sum + item.clarityScore, 0) / processedData.length;
    const avgPace = processedData.reduce((sum, item) => sum + item.pace, 0) / processedData.length;
    const avgRhythm = processedData.reduce((sum, item) => sum + item.rhythmScore, 0) / processedData.length;
    const totalFillerWords = processedData.reduce((sum, item) => sum + item.fillerWordCount, 0);
    const totalHesitations = processedData.reduce((sum, item) => sum + item.hesitationCount, 0);
    
    // Calculate trend (positive or negative) based on first and last entries
    const clarityTrend = processedData.length > 1 ? 
      processedData[processedData.length - 1].clarityScore - processedData[0].clarityScore : 0;
    const paceTrend = processedData.length > 1 ? 
      processedData[processedData.length - 1].pace - processedData[0].pace : 0;
    
    return {
      avgClarity: avgClarity.toFixed(1),
      avgPace: avgPace.toFixed(1),
      avgRhythm: avgRhythm.toFixed(1),
      totalFillerWords,
      totalHesitations,
      clarityTrend,
      paceTrend,
      sessions: processedData.length
    };
  }, [processedData]);

  return { processedData, insights };
}
