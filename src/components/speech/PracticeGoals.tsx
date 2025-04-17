
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/lib/supabase';
import GoalForm from './GoalForm';
import GoalList from './GoalList';

interface PracticeGoal {
  id: string;
  goal_type: 'sessions' | 'occasions' | 'hours' | 'notes';
  target: number;
  deadline: string;
  progress: number;
}

interface PracticeGoalsProps {
  userId: string | null;
  stats: {
    totalSessions: number;
    uniqueOccasions: number;
    totalHours: number;
    notesAdded: number;
  };
  shareUrl: string;
}

const PracticeGoals: React.FC<PracticeGoalsProps> = ({ userId, stats, shareUrl }) => {
  const [goals, setGoals] = useState<PracticeGoal[]>([]);
  const [newGoalType, setNewGoalType] = useState<'sessions' | 'occasions' | 'hours' | 'notes'>('sessions');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('practice_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load practice goals.',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        const updatedGoals = data.map((goal) => ({
          ...goal,
          progress: getGoalProgress(goal.goal_type, stats),
        }));
        setGoals(updatedGoals);
        trackEvent('view_practice_goals', 'Practice', 'Goals Loaded');
      }
    };

    fetchGoals();
  }, [userId, stats, toast, trackEvent]);

  const getGoalProgress = (goalType: PracticeGoal['goal_type'], stats: PracticeGoalsProps['stats']) => {
    switch (goalType) {
      case 'sessions':
        return stats.totalSessions;
      case 'occasions':
        return stats.uniqueOccasions;
      case 'hours':
        return stats.totalHours;
      case 'notes':
        return stats.notesAdded;
      default:
        return 0;
    }
  };

  const handleAddGoal = async () => {
    if (!userId || !newGoalTarget || !newGoalDeadline) {
      toast({
        title: 'Error',
        description: 'Please fill in all goal details.',
        variant: 'destructive',
      });
      return;
    }

    const target = parseInt(newGoalTarget);
    if (isNaN(target) || target <= 0) {
      toast({
        title: 'Error',
        description: 'Target must be a positive number.',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await supabase
      .from('practice_goals')
      .insert({
        user_id: userId,
        goal_type: newGoalType,
        target,
        deadline: newGoalDeadline,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to add practice goal.',
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      const newGoal: PracticeGoal = {
        ...data,
        progress: getGoalProgress(newGoalType, stats),
      };
      
      setGoals([...goals, newGoal]);
      setNewGoalTarget('');
      setNewGoalDeadline('');
      
      toast({
        title: 'Goal Added',
        description: `New goal set: ${target} ${newGoalType} by ${new Date(newGoalDeadline).toLocaleDateString()}`,
      });
      
      trackEvent('set_practice_goal', 'Practice', newGoalType);
    }
  };

  const handleShareGoal = (goal: PracticeGoal) => {
    trackEvent('share_goal_achievement', 'Practice', goal.goal_type);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Practice Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <GoalForm
          newGoalType={newGoalType}
          setNewGoalType={setNewGoalType}
          newGoalTarget={newGoalTarget}
          setNewGoalTarget={setNewGoalTarget}
          newGoalDeadline={newGoalDeadline}
          setNewGoalDeadline={setNewGoalDeadline}
          onAddGoal={handleAddGoal}
        />
        <GoalList goals={goals} shareUrl={shareUrl} onShareGoal={handleShareGoal} />
      </CardContent>
    </Card>
  );
};

export default PracticeGoals;
