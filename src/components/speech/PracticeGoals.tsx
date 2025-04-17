import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PracticeGoalsProps } from './PracticeGoalsProps';

const PracticeGoals: React.FC<PracticeGoalsProps> = ({ userId, stats }) => {
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

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Practice Goals
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => document.getElementById('goal-form')?.focus()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="goal-form" className="mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={newGoalType} onValueChange={(value) => setNewGoalType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Goal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sessions">Practice Sessions</SelectItem>
                <SelectItem value="occasions">Unique Occasions</SelectItem>
                <SelectItem value="hours">Practice Hours</SelectItem>
                <SelectItem value="notes">Session Notes</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Target (e.g., 20)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              min="1"
            />
            <Input
              type="date"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <Button onClick={handleAddGoal} className="w-full sm:w-auto">
            Set New Goal
          </Button>
        </div>

        {goals.length > 0 && (
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
                  indicatorClassName={getProgressColor(goal.progress, goal.target)}
                />
                <p className="text-sm text-muted-foreground">
                  {goal.progress} of {goal.target} completed
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeGoals;
