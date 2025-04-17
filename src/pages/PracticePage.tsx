
import React from 'react';
import { usePracticeData } from '@/hooks/usePracticeData';
import { useOccasionHandlers } from '@/hooks/useOccasionHandlers';
import PracticePageHeader from '@/components/speech/PracticePageHeader';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';

const PracticePage: React.FC = () => {
  const {
    selectedOccasion,
    setSelectedOccasion,
    favorites,
    setFavorites,
    progressStats,
    userId,
    blogPreviews,
    setBlogPreviews,
  } = usePracticeData();

  const { handleSelect, handleSelectSession } = useOccasionHandlers(setSelectedOccasion);

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

