import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { PracticeSession } from '@/types/practiceTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PracticeHistoryProps {
  userId: string | null;
  occasionName: string;
  onSelectSession?: (sessionId: string) => void;
}

const PracticeHistory: React.FC<PracticeHistoryProps> = ({ userId, occasionName, onSelectSession }) => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (!userId || !occasionName) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('occasion_name', occasionName)
          .order('session_date', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const typedSessions: PracticeSession[] = data.map((session: any) => ({
            id: String(session.id),
            occasion_name: String(session.occasion_name || ''),
            session_date: String(session.session_date || ''),
            notes: String(session.notes || '')
          }));
          
          setSessions(typedSessions);
        }
      } catch (error) {
        console.error('Error fetching practice history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load practice history.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionHistory();
  }, [userId, occasionName, toast]);

  if (isLoading) {
    return <div className="text-center py-4">Loading practice history...</div>;
  }

  if (sessions.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Practice History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No practice sessions found for this occasion.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Practice History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{new Date(session.session_date).toLocaleDateString()}</h4>
              </div>
              {session.notes && (
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeHistory;
