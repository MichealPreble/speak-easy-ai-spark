
import React from "react";
import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";

interface SpeechQualityScoreProps {
  score: number;
  duration: number;
}

const SpeechQualityScore: React.FC<SpeechQualityScoreProps> = ({ score, duration }) => {
  if (duration <= 3) return null;
  
  const isGoodScore = score >= 7;
  const isMediumScore = score >= 4 && score < 7;
  
  return (
    <div className="p-3 border-t border-border/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <BarChart2 className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">Speech Quality</span>
        </div>
        
        <div className="text-sm font-medium">
          {isGoodScore ? 'Good' : isMediumScore ? 'Average' : 'Needs Work'}
        </div>
      </div>
      
      {/* Progress bar visualization */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${
            isGoodScore 
              ? 'bg-green-500' 
              : isMediumScore 
                ? 'bg-amber-500' 
                : 'bg-red-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Numeric indicator */}
      <div className="flex justify-end mt-1">
        <span className="text-xs text-muted-foreground">{score}/10</span>
      </div>
    </div>
  );
};

export default SpeechQualityScore;
