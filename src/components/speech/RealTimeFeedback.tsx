
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { 
  Mic, 
  Volume2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Activity,
  MessageCircle,
  Gauge,
  Timer,
  BarChart2,
  TrendingUp
} from "lucide-react";
import { detectHesitations, analyzeSpokenCadence } from "@/utils/transcriptProcessing";

interface RealTimeFeedbackProps {
  isActive: boolean;
  transcript: string;
  duration: number;
  feedback?: SpeechFeedback;
}

const RealTimeFeedback: React.FC<RealTimeFeedbackProps> = ({
  isActive,
  transcript,
  duration,
  feedback
}) => {
  const [tips, setTips] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<{
    speed: number | null;
    wordCount: number;
    pitchVariation: number | null;
    fillerWordsCount: number;
  }>({
    speed: null,
    wordCount: 0,
    pitchVariation: null,
    fillerWordsCount: 0
  });
  
  // Score calculation based on metrics
  const calculateScore = (feedbackData?: SpeechFeedback): number => {
    if (!feedbackData) return 0;
    
    let score = 10; // Start with perfect score
    
    // Deduct for too fast or too slow
    if (feedbackData.speed > 180) score -= 2;
    else if (feedbackData.speed < 120 && duration > 5) score -= 1;
    
    // Deduct for filler words
    score -= Math.min(3, feedbackData.fillerWords.length * 0.5);
    
    // Deduct for low pitch variation
    if (feedbackData.pitchVariation < 30 && duration > 5) score -= 2;
    
    // Deduct for hesitations
    const hesitations = detectHesitations(transcript);
    if (hesitations.count > 2) score -= hesitations.count * 0.5;
    
    // Ensure score is between 1-10
    return Math.max(1, Math.min(10, Math.round(score)));
  };
  
  useEffect(() => {
    if (!isActive || !transcript || transcript.length < 10) {
      setTips([]);
      return;
    }
    
    const newTips: string[] = [];
    const newMetrics = { 
      speed: feedback?.speed || null,
      wordCount: transcript.split(/\s+/).filter(Boolean).length,
      pitchVariation: feedback?.pitchVariation || null,
      fillerWordsCount: feedback?.fillerWords.length || 0
    };
    
    setMetrics(newMetrics);
    
    // Analyze speech in real-time and provide feedback
    if (feedback) {
      // Check speaking speed
      if (feedback.speed > 180) {
        newTips.push("Try slowing down a bit for better clarity");
      } else if (feedback.speed < 120 && duration > 5) {
        newTips.push("Consider speaking a bit faster to maintain engagement");
      }
      
      // Check for filler words
      if (feedback.fillerWords.length > 0 && feedback.duration > 5) {
        newTips.push(`Watch for filler words like "${feedback.fillerWords.join('", "')}"`);
      }
      
      // Check pitch variation
      if (feedback.pitchVariation < 30 && duration > 8) {
        newTips.push("Try varying your pitch more to sound more engaging");
      }
      
      // Check volume variation
      if (feedback.volumeVariation < 10 && duration > 8) {
        newTips.push("Add more volume variation for emphasis");
      }
    }
    
    // Analyze hesitations
    const hesitations = detectHesitations(transcript);
    if (hesitations.count > 2) {
      newTips.push(`You've repeated words ${hesitations.count} times. Try to speak more fluidly.`);
    }
    
    // Analyze cadence
    const cadenceScore = analyzeSpokenCadence(transcript, duration);
    if (cadenceScore < 5 && duration > 10) {
      newTips.push("Your speech rhythm could be more balanced. Try varying sentence length.");
    }
    
    // Only keep the most recent 3 tips to avoid overwhelming the user
    setTips(newTips.slice(0, 3));
  }, [isActive, transcript, duration, feedback]);

  if (!isActive) return null;

  const speechScore = calculateScore(feedback);
  const isGoodScore = speechScore >= 7;
  const isMediumScore = speechScore >= 4 && speechScore < 7;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg overflow-hidden dark:bg-black/90">
      <div className="flex items-center justify-between p-3 bg-primary/10">
        <div className="flex items-center">
          <Mic className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Real-time Feedback</h3>
        </div>
        <div className="flex space-x-1">
          {isActive && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </div>
      </div>
      
      {/* Active recording indicator */}
      {isActive && (
        <div className="px-3 py-2 bg-rose-500/10 flex items-center text-sm text-rose-600 dark:text-rose-400">
          <Timer className="h-4 w-4 mr-2 animate-pulse" />
          <span className="font-medium">Recording in progress...</span>
        </div>
      )}
      
      {/* Speech metrics */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30">
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1.5 text-primary/70" />
          <span>Duration: {Math.round(duration)}s</span>
        </div>
        
        {metrics.speed !== null && (
          <div className="flex items-center text-sm">
            <Gauge className="h-4 w-4 mr-1.5 text-primary/70" />
            <span>Pace: {metrics.speed} wpm</span>
          </div>
        )}
        
        <div className="flex items-center text-sm">
          <MessageCircle className="h-4 w-4 mr-1.5 text-primary/70" />
          <span>Words: {metrics.wordCount}</span>
        </div>
        
        {metrics.fillerWordsCount > 0 && (
          <div className="flex items-center text-sm">
            <Activity className="h-4 w-4 mr-1.5 text-primary/70" />
            <span>Fillers: {metrics.fillerWordsCount}</span>
          </div>
        )}
      </div>
      
      {/* Speech quality visualization */}
      {duration > 3 && (
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
              animate={{ width: `${speechScore * 10}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Numeric indicator */}
          <div className="flex justify-end mt-1">
            <span className="text-xs text-muted-foreground">{speechScore}/10</span>
          </div>
        </div>
      )}
      
      {/* Speech trend analysis */}
      {duration > 8 && feedback && (
        <div className="p-3 border-t border-border/30">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Speech Trends</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            <div className={`flex items-center ${metrics.speed && metrics.speed > 160 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
              Pace: {metrics.speed ? (metrics.speed > 160 ? 'Fast' : metrics.speed < 120 ? 'Slow' : 'Good') : 'N/A'}
            </div>
            
            <div className={`flex items-center ${metrics.fillerWordsCount > 2 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
              Fillers: {metrics.fillerWordsCount > 2 ? 'Many' : 'Few'}
            </div>
            
            <div className={`flex items-center ${feedback.pitchVariation < 20 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
              Pitch: {feedback.pitchVariation < 20 ? 'Monotone' : 'Varied'}
            </div>
            
            <div className={`flex items-center ${feedback.volumeVariation < 15 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
              Volume: {feedback.volumeVariation < 15 ? 'Flat' : 'Dynamic'}
            </div>
          </div>
        </div>
      )}
      
      {/* Tips section */}
      <AnimatePresence>
        {tips.length > 0 && (
          <div className="p-3 border-t border-border/30">
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <motion.li
                  key={`${tip.substring(0, 10)}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start text-sm"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        
        {tips.length === 0 && duration > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 border-t border-border/30"
          >
            <div className="flex items-start text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>You're doing great! Keep speaking naturally.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeFeedback;
