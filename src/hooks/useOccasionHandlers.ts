
import { useCallback } from 'react';
import { SpeechOccasion } from '@/types/speechOccasions';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PracticeSession {
  id: string;
  occasion_name: string;
  session_date: string;
  notes?: string;
}

export const useOccasionHandlers = (
  setSelectedOccasion: (occasion: SpeechOccasion) => void
) => {
  const { trackEvent } = useAnalytics();

  const handleSelect = useCallback((occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', occasion.name);
    trackEvent('select_occasion', 'SpeechPractice', occasion.name);
  }, [setSelectedOccasion, trackEvent]);

  const handleSelectSession = useCallback((occasion: SpeechOccasion, session: PracticeSession) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', occasion.name);
    trackEvent('select_practice_session', 'SpeechPractice', occasion.name);
  }, [setSelectedOccasion, trackEvent]);

  return {
    handleSelect,
    handleSelectSession
  };
};

