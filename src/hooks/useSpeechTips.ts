
import { useMemo } from "react";

export function useSpeechTips(tips: string[], duration: number) {
  // Determine if we should show tips based on having tips and speech duration
  const hasTips = useMemo(() => tips.length > 0, [tips]);
  
  // Show positive feedback when there are no tips and speech duration is long enough
  const showPositiveFeedback = useMemo(() => !hasTips && duration > 5, [hasTips, duration]);
  
  return {
    hasTips,
    showPositiveFeedback
  };
}
