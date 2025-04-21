
import React from 'react';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import { usePracticePageData } from '@/hooks/usePracticePageData';
import { SpeechOccasion as SpeechOccasionType } from '@/types/speechOccasions';
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

  // Ensure milestones conform to the expected Milestone type, including required 'target' field
  const typedMilestones: Milestone[] = Array.isArray(milestones) 
    ? milestones.map((milestone): Milestone => {
        if (typeof milestone === 'string') {
          // Convert string to proper Milestone object with required fields
          return { 
            id: milestone, 
            label: milestone,
            title: milestone,
            description: `Milestone: ${milestone}`,
            achieved: false,
            progress: 0,
            target: 1, // Provide default target since it's required
            tip: `Tip for ${milestone}`,
            completed: false
          };
        }
        // If it's already a Milestone object, ensure required fields are present and provide defaults for missing values
        return {
          id: milestone.id,
          label: milestone.label,
          title: milestone.title || milestone.label || 'Untitled Milestone',
          description: milestone.description || 'Keep practicing to improve',
          achieved: milestone.achieved,
          progress: milestone.progress,
          target: milestone.target !== undefined ? milestone.target : 1, // default to 1 if missing
          tip: milestone.tip || 'Keep practicing to improve',
          completed: milestone.completed ?? false,
        };
      })
    : [];

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
  const handleOccasionSelect = (occasion: SpeechOccasionType) => {
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
            blogPreviews={blogPreviews || []}
            setBlogPreviews={setBlogPreviews}
          />
        </div>
      )}
    </>
  );
};

export default PracticePageContent;
