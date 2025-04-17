
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PracticeGoal {
  id: string;
  goal_type: 'sessions' | 'occasions' | 'hours' | 'notes';
  target: number;
  deadline: string;
  progress: number;
}

interface GoalListProps {
  goals: PracticeGoal[];
  shareUrl: string;
  onShareGoal: (goal: PracticeGoal) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, shareUrl, onShareGoal }) => {
  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-medium">
              {goal.target} {goal.goal_type} by {new Date(goal.deadline).toLocaleDateString()}
            </p>
            <span className="text-sm text-muted-foreground">
              {Math.round((goal.progress / goal.target) * 100)}%
            </span>
          </div>
          <Progress 
            value={(goal.progress / goal.target) * 100} 
            className="h-2"
            indicatorClassName={
              goal.progress >= goal.target ? 'bg-green-500' :
              (goal.progress / goal.target) >= 0.75 ? 'bg-blue-500' :
              (goal.progress / goal.target) >= 0.5 ? 'bg-yellow-500' :
              'bg-primary'
            }
          />
          <p className="text-sm text-muted-foreground">
            {goal.progress} of {goal.target} completed
          </p>
          {goal.progress >= goal.target && new Date(goal.deadline) >= new Date() && (
            <Alert>
              <AlertTitle>Congratulations!</AlertTitle>
              <AlertDescription>
                You achieved your goal of {goal.target} {goal.goal_type}!
              </AlertDescription>
            </Alert>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoalList;
