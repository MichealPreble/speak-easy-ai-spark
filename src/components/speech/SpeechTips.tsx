
import React from "react";
import { useSpeechTips } from "@/hooks/useSpeechTips";
import TipList from "./TipList";
import PositiveFeedback from "./PositiveFeedback";

interface SpeechTipsProps {
  tips: string[];
  duration: number;
}

const SpeechTips: React.FC<SpeechTipsProps> = ({ tips, duration }) => {
  const { hasTips, showPositiveFeedback } = useSpeechTips(tips, duration);
  
  if (!hasTips && !showPositiveFeedback) return null;
  
  return (
    <div className="p-3 border-t border-border/30">
      <div className="text-xs font-medium mb-2">Tips & Feedback</div>
      
      {hasTips ? (
        <TipList tips={tips} />
      ) : showPositiveFeedback ? (
        <PositiveFeedback />
      ) : null}
    </div>
  );
};

export default SpeechTips;
