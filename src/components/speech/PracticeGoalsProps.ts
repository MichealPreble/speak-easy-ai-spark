
export interface PracticeGoalsProps {
  userId: string | null;
  stats: {
    totalSessions: number;
    uniqueOccasions: number;
    totalHours: number;
    notesAdded: number;
  };
}
