
import React from "react";
import { AnimatePresence } from "framer-motion";
import { useSpeechTips } from "@/hooks/useSpeechTips";
import TipList from "./TipList";
import PositiveFeedback from "./PositiveFeedback";

interface SpeechTipsProps {
  tips: string[];
  duration: number;
}

const SpeechTips: React.FC<SpeechTipsProps> = ({ tips, duration }) => {
  const { hasTips, showPositiveFeedback } = useSpeechTips(tips, duration);
  
  return (
    <AnimatePresence>
      {hasTips && (
        <div className="p-3 border-t border-border/30">
          <TipList tips={tips} />
        </div>
      )}
      
      {showPositiveFeedback && (
        <div className="p-3 border-t border-border/30">
          <PositiveFeedback />
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpeechTips;
