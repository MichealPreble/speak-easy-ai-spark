
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Clock, BookOpen, FileText, Trophy, Target, Star, Medal } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { Milestone } from '@/types/practiceTypes';

interface ProgressTrackerProps {
  totalSessions: number;
  uniqueOccasions: number;
  totalDuration: number;
  notesAdded: number;
  milestones: Milestone[];
  shareUrl: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalSessions,
  uniqueOccasions,
  totalDuration,
  notesAdded,
  milestones,
  shareUrl
}) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('view_progress_stats', 'Practice', 'Progress Stats Loaded');
  }, [trackEvent]);

  const getMilestones = () => {
    return milestones.filter(milestone => milestone.achieved);
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
                <p className="text-2xl font-bold">{uniqueOccasions}</p>
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
                <p className="text-2xl font-bold">{notesAdded}</p>
              </div>
            </div>
          </div>

          {getMilestones().length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Achievement Badges</h3>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {getMilestones().map((milestone) => (
                    <Tooltip key={milestone.id}>
                      <TooltipTrigger asChild>
                        <Badge 
                          className="bg-green-500 text-white cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleMilestoneClick(milestone.title)}
                        >
                          {milestone.title}
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
