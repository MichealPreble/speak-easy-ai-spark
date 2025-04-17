
import React from "react";
import { GraduationCap, BookOpen } from "lucide-react";

interface ReadabilityInsightsProps {
  readabilityScore: number;
  readabilityGrade: string;
  complexWords: string[];
}

const ReadabilityInsights: React.FC<ReadabilityInsightsProps> = ({
  readabilityScore,
  readabilityGrade,
  complexWords
}) => {
  // Determine a color based on readability score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };
  
  return (
    <div>
      <div className="text-xs font-medium mb-2 flex items-center">
        <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
        <span>Language Level</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <BookOpen className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span className="text-sm">{readabilityGrade}</span>
        </div>
        <div className={`text-sm font-medium ${getScoreColor(readabilityScore)}`}>
          {readabilityScore}/100
        </div>
      </div>
      
      {complexWords.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">
            {complexWords.length > 1 
              ? `Found ${complexWords.length} advanced vocabulary words:`
              : "Found 1 advanced vocabulary word:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {complexWords.slice(0, 5).map((word, index) => (
              <span key={index} className="text-xs bg-primary/10 px-1.5 py-0.5 rounded text-primary">
                {word}
              </span>
            ))}
            {complexWords.length > 5 && (
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                +{complexWords.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadabilityInsights;
