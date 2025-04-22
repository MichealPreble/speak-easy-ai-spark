
import React from 'react';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import { usePracticePageData } from '@/hooks/usePracticePageData';
import { SpeechOccasion, LegacySpeechOccasion } from '@/types/speechOccasions';
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

  // Ensure milestones conform to the expected Milestone type
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

  // Convert to legacy format for compatibility with existing components
  const convertedOccasion: LegacySpeechOccasion | null = selectedOccasion ? {
    name: selectedOccasion.title,
    occasion: selectedOccasion.description,
    examples: '',
    audienceSize: selectedOccasion.duration,
    audienceSizeCategory: 'Small',
    frequency: 'Rare',
    task: selectedOccasion.difficulty,
    blogTag: ''
  } : null;

  const handleOccasionSelect = (occasion: SpeechOccasion) => {
    handleSelect(occasion);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        <div className="glass-card shadow-adaptive rounded-2xl p-6 mb-6 hover:scale-[1.02] transition-transform duration-200">
          <ProgressTracker
            totalSessions={totalSessions}
            uniqueOccasions={uniqueOccasions}
            totalDuration={totalMinutes}
            notesAdded={notesAdded}
            milestones={typedMilestones}
            shareUrl={shareUrl}
          />
        </div>

        <div className="glass-card shadow-adaptive rounded-2xl p-6 mb-6 hover:scale-[1.02] transition-transform duration-200">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-2">
        <div className="glass-card shadow-adaptive rounded-2xl p-4 mb-6 hover:scale-[1.02] transition-transform duration-200">
          <SpeechOccasionSelector 
            value={selectedOccasion}
            onChange={handleOccasionSelect}
          />
        </div>
        <div className="glass-card shadow-adaptive rounded-2xl p-4 mb-6 hover:scale-[1.02] transition-transform duration-200">
          <FavoriteOccasions
            favorites={favorites}
            onSelectFavorite={handleOccasionSelect}
          />
        </div>
      </div>

      <div className="glass-card shadow-adaptive rounded-2xl p-4 mb-6 hover:scale-[1.02] transition-transform duration-200">
        <RecentOccasions 
          userId={userId}
          onSelectRecent={(title) => {
            // Find speech occasion by title and select it
            const allOccasions: SpeechOccasion[] = Object.values(SPEECH_OCCASIONS).flat();
            const occasion = allOccasions.find(o => o.title === title);
            if (occasion) handleSelect(occasion);
          }} 
        />
      </div>

      {selectedOccasion && (
        <div className="glass-card shadow-adaptive rounded-2xl p-4 mb-6 hover:scale-[1.02] transition-transform duration-200 mt-4">
          <PracticeHistory 
            userId={userId}
            occasionName={selectedOccasion.title}
            onSelectSession={handleSelectSession} 
          />
        </div>
      )}

      {selectedOccasion && convertedOccasion && (
        <div className="glass-card shadow-adaptive rounded-2xl p-4 mb-6 hover:scale-[1.02] transition-transform duration-200 mt-6">
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
