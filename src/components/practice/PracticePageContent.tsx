
import React from 'react';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import { usePracticePageData } from '@/hooks/usePracticePageData';

const PracticePageContent: React.FC = () => {
  const {
    selectedOccasion,
    favorites,
    setFavorites,
    blogPreviews,
    setBlogPreviews,
    totalSessions,
    uniqueOccasions,
    totalMinutes,
    notesAdded,
    milestones,
    userId,
    shareUrl,
    handleSelect,
    handleSelectSession
  } = usePracticePageData();

  return (
    <>
      <ProgressTracker
        totalSessions={totalSessions}
        uniqueOccasions={uniqueOccasions}
        totalDuration={totalMinutes}
        notesAdded={notesAdded}
        milestones={milestones}
        shareUrl={shareUrl}
      />
      <PracticeGoals
        userId={userId}
        stats={{ 
          totalSessions, 
          uniqueOccasions, 
          totalHours: totalMinutes / 60, 
          notesAdded 
        }}
        shareUrl={shareUrl}
      />
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
    </>
  );
};

export default PracticePageContent;
