
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
          return { 
            id: milestone, 
            label: milestone,
            title: milestone,
            description: `Milestone: ${milestone}`,
            achieved: false,
            progress: 0,
            target: 1,
            tip: `Tip for ${milestone}`,
            completed: false
          };
        }
        return {
          id: milestone.id,
          label: milestone.label,
          title: milestone.title || milestone.label || 'Untitled Milestone',
          description: milestone.description || 'Keep practicing to improve',
          achieved: milestone.achieved,
          progress: milestone.progress,
          target: milestone.target !== undefined ? milestone.target : 1,
          tip: milestone.tip || 'Keep practicing to improve',
          completed: milestone.completed ?? false,
        };
      })
    : [];

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

  const handleOccasionSelect = (occasion: SpeechOccasionType) => {
    handleSelect(occasion.name);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-4xl mx-auto py-6">
      <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl">
        <ProgressTracker
          totalSessions={totalSessions}
          uniqueOccasions={uniqueOccasions}
          totalDuration={totalMinutes}
          notesAdded={notesAdded}
          milestones={typedMilestones}
          shareUrl={shareUrl}
        />
      </div>

      <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl">
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
      </div>

      <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl p-0">
        <SpeechOccasionSelector 
          onSelectOccasion={handleOccasionSelect}
        />
      </div>

      <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl">
        <FavoriteOccasions
          favorites={favorites}
          onSelectFavorite={handleOccasionSelect}
        />
      </div>

      <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl">
        <RecentOccasions 
          userId={userId}
          onSelectRecent={handleSelect} 
        />
      </div>
      {selectedOccasion && (
        <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl mt-4">
          <PracticeHistory 
            userId={userId}
            occasionName={selectedOccasion}
            onSelectSession={handleSelectSession} 
          />
        </div>
      )}
      {selectedOccasion && convertedOccasion && (
        <div className="glass-card shadow-lg transition-shadow duration-200 hover:shadow-2xl mt-6">
          <OccasionDetails
            occasion={convertedOccasion}
            favorites={favorites}
            setFavorites={setFavorites}
            blogPreviews={blogPreviews || []}
            setBlogPreviews={setBlogPreviews}
          />
        </div>
      )}
    </div>
  );
};

export default PracticePageContent;
