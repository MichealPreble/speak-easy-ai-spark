
import React from 'react';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import { usePracticePageData } from '@/hooks/usePracticePageData';
import { SpeechOccasion } from '@/types/speechOccasions';
import { Milestone } from '@/types/practiceTypes';

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

  // Convert string[] to Milestone[] to satisfy type requirements
  const typedMilestones: Milestone[] = milestones.map(
    (milestone: string): Milestone => ({ id: milestone, label: milestone })
  );

  // Type conversion for string to SpeechOccasion for selectedOccasion
  const convertedOccasion = selectedOccasion ? {
    name: selectedOccasion,
    occasion: selectedOccasion,
    examples: '',
    audienceSize: '',
    audienceSizeCategory: 'Small' as const,
    frequency: 'Rare' as const,
    task: '',
    blogTag: ''
  } : null;

  // Wrapper function to convert string parameter to SpeechOccasion
  const handleOccasionSelect = (occasion: SpeechOccasion) => {
    handleSelect(occasion.name);
  };

  return (
    <>
      <ProgressTracker
        totalSessions={totalSessions}
        uniqueOccasions={uniqueOccasions}
        totalDuration={totalMinutes}
        notesAdded={notesAdded}
        milestones={typedMilestones}
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
      <SpeechOccasionSelector onSelectOccasion={handleOccasionSelect} />
      <FavoriteOccasions
        favorites={favorites}
        onSelectFavorite={handleOccasionSelect}
      />
      <RecentOccasions 
        userId={userId}
        onSelectRecent={handleSelect} 
      />
      <PracticeHistory 
        userId={userId}
        occasionName={selectedOccasion || ''}
        onSelectSession={handleSelectSession} 
      />
      {selectedOccasion && convertedOccasion && (
        <div className="mt-6">
          <OccasionDetails
            occasion={convertedOccasion}
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
