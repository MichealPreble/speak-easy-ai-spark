
import { useState, useEffect } from 'react';

export function useSpeechRate(transcript: string, isSpeaking: boolean) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);

  useEffect(() => {
    if (isSpeaking && !startTime) {
      setStartTime(Date.now());
    }

    if (!isSpeaking && startTime) {
      const endTime = Date.now();
      const minutes = (endTime - startTime) / 60000;
      const wordCount = transcript.trim().split(/\s+/).length;
      const calculatedWpm = Math.round(wordCount / minutes);
      setWpm(calculatedWpm);
      setStartTime(null);
    }
  }, [isSpeaking, startTime, transcript]);

  return { wpm };
}
