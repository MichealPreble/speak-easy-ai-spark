
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Clock, BookOpen, FileText, Trophy, Target, Star, Medal } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ProgressTrackerProps {
  totalSessions: number;
  totalOccasions: number;
  totalDuration: number;
  totalNotes: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalSessions,
  totalOccasions,
  totalDuration,
  totalNotes
}) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('view_progress_stats', 'Practice', 'Progress Stats Loaded');
  }, [trackEvent]);

  const getMilestones = () => {
    const milestones = [];
    
    if (totalSessions >= 10) {
      milestones.push({
        icon: <Trophy className="h-4 w-4" />,
        title: "Practice Champion",
        description: "Completed 10 practice sessions",
        color: "bg-amber-500"
      });
    }
    
    if (totalOccasions >= 5) {
      milestones.push({
        icon: <Target className="h-4 w-4" />,
        title: "Versatile Speaker",
        description: "Practiced 5 different occasions",
        color: "bg-purple-500"
      });
    }
    
    if (totalDuration >= 300) { // 5 hours
      milestones.push({
        icon: <Star className="h-4 w-4" />,
        title: "Dedicated Learner",
        description: "Practiced for 5+ hours",
        color: "bg-blue-500"
      });
    }
    
    if (totalNotes >= 5) {
      milestones.push({
        icon: <Medal className="h-4 w-4" />,
        title: "Reflective Speaker",
        description: "Added 5 practice notes",
        color: "bg-green-500"
      });
    }

    return milestones;
  };

  const handleMilestoneClick = (title: string) => {
    trackEvent('click_milestone', 'Practice', title);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Occasions</p>
                <p className="text-2xl font-bold">{totalOccasions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Hours Practiced</p>
                <p className="text-2xl font-bold">{(totalDuration / 60).toFixed(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Notes Added</p>
                <p className="text-2xl font-bold">{totalNotes}</p>
              </div>
            </div>
          </div>

          {getMilestones().length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Achievement Badges</h3>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {getMilestones().map((milestone) => (
                    <Tooltip key={milestone.title}>
                      <TooltipTrigger asChild>
                        <Badge 
                          className={`${milestone.color} text-white cursor-pointer transition-transform hover:scale-105`}
                          onClick={() => handleMilestoneClick(milestone.title)}
                        >
                          {milestone.icon}
                          <span className="ml-1">{milestone.title}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{milestone.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
