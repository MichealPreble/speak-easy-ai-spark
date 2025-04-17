
import React from "react";
import { Mic, VolumeX } from "lucide-react";

interface EnunciationFeedbackProps {
  score: number;
}

const EnunciationFeedback: React.FC<EnunciationFeedbackProps> = ({ score }) => {
  // Get appropriate rating and description based on score
  const getRating = (score: number) => {
    if (score >= 80) return { label: "Excellent", className: "text-green-500" };
    if (score >= 65) return { label: "Good", className: "text-emerald-500" };
    if (score >= 50) return { label: "Fair", className: "text-amber-500" };
    if (score >= 35) return { label: "Needs Work", className: "text-orange-500" };
    return { label: "Poor", className: "text-rose-500" };
  };
  
  const getTip = (score: number) => {
    if (score >= 80) return "Your words are very clear and well-articulated.";
    if (score >= 65) return "Most words are clear, with good pronunciation.";
    if (score >= 50) return "Try speaking more deliberately and pronounce consonants more clearly.";
    if (score >= 35) return "Focus on slowing down and enunciating each syllable more clearly.";
    return "Practice speaking more slowly and clearly pronouncing consonants and vowels.";
  };
  
  const rating = getRating(score);
  
  return (
    <div>
      <div className="text-xs font-medium mb-2 flex items-center">
        <Mic className="h-3.5 w-3.5 mr-1.5" />
        <span>Enunciation</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className={`text-sm font-medium ${rating.className}`}>
          {rating.label}
        </div>
        <div className="text-sm">
          {score}/100
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        {getTip(score)}
      </div>
    </div>
  );
};

export default EnunciationFeedback;
