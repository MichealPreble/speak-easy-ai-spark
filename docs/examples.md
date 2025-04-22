
# SpeakEasyAI Examples

This document provides real-world examples of how to use SpeakEasyAI for various conversation and speech practice scenarios.

## Basic Chat Interaction

```jsx
import React from 'react';
import { Chat } from '@/components/chat/Chat';

const BasicChatExample = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chat with AI Assistant</h1>
      <Chat />
    </div>
  );
};

export default BasicChatExample;
```

## Speech Practice Session

```jsx
import React, { useState } from 'react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { SpeechOccasionSelector } from '@/components/speech/SpeechOccasionSelector';
import { RecordingIndicator } from '@/components/speech/RecordingIndicator';
import { RecordingTimer } from '@/components/speech/RecordingTimer';
import { PracticeFeedback } from '@/components/speech/PracticeFeedback';

const SpeechPracticeExample = () => {
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  const handleVoiceMessage = (newTranscript, newFeedback) => {
    setTranscript(newTranscript);
    setFeedback(newFeedback);
  };
  
  const {
    isVoiceActive,
    toggleVoice,
    recordingDuration,
    isBrowserSupported
  } = useVoiceRecognition(handleVoiceMessage);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Speech Practice</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Select Occasion</h2>
        <SpeechOccasionSelector
          value={selectedOccasion}
          onChange={setSelectedOccasion}
        />
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => toggleVoice()}
          disabled={!isBrowserSupported}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          {isVoiceActive ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {isVoiceActive && (
          <>
            <RecordingIndicator />
            <RecordingTimer duration={recordingDuration} />
          </>
        )}
      </div>
      
      {transcript && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Your Speech</h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            {transcript}
          </div>
        </div>
      )}
      
      {feedback && <PracticeFeedback feedback={feedback} />}
    </div>
  );
};

export default SpeechPracticeExample;
```

## Using Speech Analysis in Custom Components

```jsx
import React, { useState } from 'react';
import { analyzeFullSpeech } from '@/utils/speech';

const SpeechAnalysisExample = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  const handleAnalyze = () => {
    if (text.trim().length > 0) {
      const result = analyzeFullSpeech(text, {
        detectHesitations: true,
        analyzeCadence: true,
        analyzeClarity: true
      });
      setAnalysis(result);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Speech Analysis</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter text to analyze
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={5}
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        className="px-4 py-2 bg-primary text-white rounded-md mb-6"
      >
        Analyze Speech
      </button>
      
      {analysis && (
        <div>
          <h2 className="text-lg font-medium mb-2">Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2">Clarity Score</h3>
              <p className="text-2xl">{analysis.clarityScore.overall}/100</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2">Hesitations</h3>
              <p className="text-2xl">{analysis.hesitations.count}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2">Pace</h3>
              <p className="text-2xl">{analysis.cadence.wordsPerMinute} WPM</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechAnalysisExample;
```

## Theme Toggle Implementation

```jsx
import React from 'react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleExample = () => {
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggleExample;
```

## Search Implementation

```jsx
import React, { useState } from 'react';
import { useMessageSearch } from '@/hooks/useMessageSearch';
import { SearchIcon, XCircle } from 'lucide-react';

const SearchExample = () => {
  const [query, setQuery] = useState('');
  const { searchMessages } = useMessageSearch();
  const [results, setResults] = useState([]);
  
  const handleSearch = () => {
    if (query.trim().length > 0) {
      const searchResults = searchMessages(query);
      setResults(searchResults);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Message Search</h1>
      
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full p-2 pl-10 border rounded-md"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <XCircle className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-primary text-white rounded-md mb-6"
      >
        Search
      </button>
      
      {results.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-2">Search Results</h2>
          <ul className="divide-y">
            {results.map((message) => (
              <li key={message.id} className="py-3">
                <p className="text-sm text-gray-500">{message.sender}</p>
                <p>{message.content}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : query ? (
        <p>No results found</p>
      ) : null}
    </div>
  );
};

export default SearchExample;
```
