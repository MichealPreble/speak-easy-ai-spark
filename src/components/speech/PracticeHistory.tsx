
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';
import { SpeechOccasion } from '@/types/speechOccasions';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PracticeSession {
  id: string;
  occasion_name: string;
  session_date: string;
  notes?: string;
}

interface PracticeHistoryProps {
  onSelectSession: (occasion: SpeechOccasion, session: PracticeSession) => void;
}

const PracticeHistory = ({ onSelectSession }: PracticeHistoryProps) => {
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchPracticeSessions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('practice_sessions')
        .select('id, occasion_name, session_date, notes')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching practice sessions:', error);
        return;
      }

      if (data) {
        setPracticeSessions(data);
        trackEvent('view_practice_history', 'Practice', 'Practice History Loaded');
      }
    };

    fetchPracticeSessions();
  }, [trackEvent]);

  const handleSelectSession = (session: PracticeSession) => {
    const occasion = SPEECH_OCCASIONS
      .flatMap(cat => cat.occasions)
      .find(occ => occ.name === session.occasion_name);
      
    if (occasion) {
      onSelectSession(occasion, session);
      trackEvent('select_practice_session', 'Practice', session.occasion_name);
    }
  };

  if (!practiceSessions.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Practice History</h2>
      <div className="space-y-2">
        {practiceSessions.map((session) => (
          <Button
            key={session.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleSelectSession(session)}
            aria-label={`Select practice session for ${session.occasion_name}`}
          >
            <div className="text-left">
              <p className="font-medium">{session.occasion_name}</p>
              <p className="text-sm text-muted-foreground">{session.session_date}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PracticeHistory;
