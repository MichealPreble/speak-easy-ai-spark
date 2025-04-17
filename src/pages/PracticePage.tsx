
import React from 'react';
import PracticePageHeader from '@/components/practice/PracticePageHeader';
import PracticePageContent from '@/components/practice/PracticePageContent';

const PracticePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PracticePageHeader />
      <PracticePageContent />
    </div>
  );
};

export default PracticePage;
