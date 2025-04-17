
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, BookOpen, FileText } from 'lucide-react';

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
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
