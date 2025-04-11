
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { InfoCircle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpeechClarityProps {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  suggestions: string[];
}

const SpeechClarityFeedback = ({ score, rating, suggestions }: SpeechClarityProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getRatingIcon = () => {
    switch(rating) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'fair':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'needs improvement':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <InfoCircle className="h-4 w-4" />;
    }
  };
  
  const getRatingColor = () => {
    switch(rating) {
      case 'excellent': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'good': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'fair': return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'needs improvement': return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Clarity</span>
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <InfoCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[220px]">
                <p className="text-xs">
                  Speech clarity measures how well you articulate words and organize sentences
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <Badge className={`flex gap-1 items-center ${getRatingColor()}`} variant="outline">
            {getRatingIcon()}
            <span className="font-semibold">{score}/10</span>
          </Badge>
        </div>
      </div>
      
      {suggestions.length > 0 && (
        <TooltipProvider>
          <Tooltip open={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger asChild>
              <div 
                className="px-3 py-2 rounded-md text-sm bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="flex items-center justify-between">
                  <span className="font-medium">{rating}</span>
                  <InfoCircle className="h-4 w-4 text-muted-foreground" />
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[280px]">
              <div className="space-y-2">
                <p className="font-medium text-sm">Clarity suggestions:</p>
                <ul className="list-disc pl-4 text-xs space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SpeechClarityFeedback;
