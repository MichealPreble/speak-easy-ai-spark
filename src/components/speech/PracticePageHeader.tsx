
import React from 'react';
import { Helmet } from 'react-helmet-async';

const PracticePageHeader: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Practice Your Speech | SpeakEasyAI</title>
        <meta name="description" content="Practice your speech for any occasion with AI-powered feedback." />
        <meta property="og:title" content="Practice Your Speech | SpeakEasyAI" />
        <meta property="og:description" content="Practice your speech for any occasion with AI-powered feedback." />
        <meta property="og:url" content="https://speakeasyai.com/practice" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Practice Your Speech</h1>
    </>
  );
};

export default PracticePageHeader;
