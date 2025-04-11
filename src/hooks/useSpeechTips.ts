
import { useMemo } from "react";

export function useSpeechTips(tips: string[], duration: number) {
  const hasTips = tips.length > 0;
  const showPositiveFeedback = !hasTips && duration > 5;
  
  return {
    hasTips,
    showPositiveFeedback
  };
}
