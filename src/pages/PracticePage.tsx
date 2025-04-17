
import React, { useState } from 'react';
import { usePracticeData } from '@/hooks/usePracticeData';
import { SpeechOccasion } from '@/types/speechOccasions';
import { useAnalytics } from '@/hooks/useAnalytics';
import PracticePageHeader from '@/components/speech/PracticePageHeader';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

interface PracticeSession {
  id: string;
  occasion_name: string;
  session_date: string;
  notes?: string;
}

const PracticePage: React.FC = () => {
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const { trackEvent } = useAnalytics();
  const {
    selectedOccasion,
    setSelectedOccasion,
    favorites,
    setFavorites,
    progressStats,
    userId
  } = usePracticeData();

  const handleSelect = (occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', occasion.name);
    trackEvent('select_occasion', 'SpeechPractice', occasion.name);
  };

  const handleSelectSession = (occasion: SpeechOccasion, session: PracticeSession) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', occasion.name);
    trackEvent('select_practice_session', 'SpeechPractice', occasion.name);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PracticePageHeader />
      
      <ProgressTracker 
        totalSessions={progressStats.totalSessions}
        totalOccasions={progressStats.uniqueOccasions}
        totalDuration={progressStats.totalHours * 60}
        totalNotes={progressStats.notesAdded}
      />
      
      <PracticeGoals userId={userId} stats={progressStats} />
      <SpeechOccasionSelector onSelectOccasion={handleSelect} />
      <FavoriteOccasions 
        favorites={favorites} 
        onSelectFavorite={handleSelect} 
      />
      <RecentOccasions onSelectRecent={handleSelect} />
      <PracticeHistory onSelectSession={handleSelectSession} />
      
      {selectedOccasion && (
        <div className="mt-6">
          <OccasionDetails
            occasion={selectedOccasion}
            favorites={favorites}
            setFavorites={setFavorites}
            blogPreviews={blogPreviews}
            setBlogPreviews={setBlogPreviews}
          />
        </div>
      )}
    </div>
  );
};

export default PracticePage;
