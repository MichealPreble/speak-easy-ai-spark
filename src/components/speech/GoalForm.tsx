
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalFormProps {
  newGoalType: 'sessions' | 'occasions' | 'hours' | 'notes';
  setNewGoalType: React.Dispatch<React.SetStateAction<'sessions' | 'occasions' | 'hours' | 'notes'>>;
  newGoalTarget: string;
  setNewGoalTarget: React.Dispatch<React.SetStateAction<string>>;
  newGoalDeadline: string;
  setNewGoalDeadline: React.Dispatch<React.SetStateAction<string>>;
  onAddGoal: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({
  newGoalType,
  setNewGoalType,
  newGoalTarget,
  setNewGoalTarget,
  newGoalDeadline,
  setNewGoalDeadline,
  onAddGoal,
}) => {
  return (
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
      <Button onClick={onAddGoal} className="w-full sm:w-auto">
        Set New Goal
      </Button>
    </div>
  );
};

export default GoalForm;
