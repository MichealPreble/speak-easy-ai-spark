
import { useState } from "react";

export function useVoiceState() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTimeLimited, setIsTimeLimited] = useState(false);
  
  const resetState = () => {
    setIsVoiceActive(false);
    setRecordingDuration(0);
    setIsTimeLimited(false);
  };

  return {
    isVoiceActive,
    setIsVoiceActive,
    recordingDuration,
    setRecordingDuration,
    isTimeLimited,
    setIsTimeLimited,
    resetState
  };
}
