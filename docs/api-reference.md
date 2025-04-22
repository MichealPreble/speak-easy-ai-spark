
# SpeakEasyAI API Reference

This document provides detailed information about the key APIs and hooks available in SpeakEasyAI.

## Chat Hooks

### `useChat`

The primary hook for managing chat functionality.

```typescript
const {
  // State
  messages,
  filteredMessages,
  input,
  setInput,
  isLoading,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  
  // Voice
  isVoiceActive,
  isBrowserSupported,
  recordingDuration,
  MAX_RECORDING_SECONDS,
  
  // Refs
  inputRef,
  scrollAreaRef,
  
  // Actions
  handleSend,
  handleClearChat,
  toggleVoice,
  toggleDarkMode,
  summarize,
  
  // UI
  showTypingIndicator
} = useChat({ selectedScenario });
```

#### Parameters

- `selectedScenario` (optional): String identifier for the conversation scenario

#### Returns

- `messages`: Array of all chat messages
- `filteredMessages`: Messages filtered by search query
- `input`: Current input text value
- `setInput`: Function to update input value
- `isLoading`: Boolean indicating if a response is loading
- `searchQuery`: Current search term
- `setSearchQuery`: Function to update search term
- `isDarkMode`: Boolean for current theme state
- `isVoiceActive`: Boolean indicating if voice recognition is active
- `isBrowserSupported`: Boolean indicating if browser supports voice recognition
- `recordingDuration`: Current voice recording duration in seconds
- `MAX_RECORDING_SECONDS`: Maximum allowed recording duration
- `inputRef`: Reference to input element
- `scrollAreaRef`: Reference to scroll area element
- `handleSend`: Function to send a message
- `handleClearChat`: Function to clear all messages
- `toggleVoice`: Function to toggle voice recognition
- `toggleDarkMode`: Function to toggle dark/light mode
- `summarize`: Function to generate conversation summary
- `showTypingIndicator`: Boolean to show typing animation

## Voice Recognition

### `useVoiceRecognition`

Hook for managing voice input and processing.

```typescript
const {
  isVoiceActive,
  toggleVoice,
  isBrowserSupported,
  recordingDuration,
  MAX_RECORDING_SECONDS
} = useVoiceRecognition(onVoiceMessage);
```

#### Parameters

- `onVoiceMessage`: Callback function that receives the transcript and feedback

#### Returns

- `isVoiceActive`: Boolean indicating if voice recognition is active
- `toggleVoice`: Function to start/stop voice recognition
- `isBrowserSupported`: Boolean indicating browser compatibility
- `recordingDuration`: Current recording duration in seconds
- `MAX_RECORDING_SECONDS`: Maximum recording duration

## Speech Analysis

### Speech Analysis Utilities

```typescript
import { 
  analyzeFullSpeech,
  analyzeFullSpeechAsync,
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm
} from '@/utils/speech';
```

#### `analyzeFullSpeech(transcript, config)`

Synchronously analyzes speech and returns detailed feedback.

#### `analyzeFullSpeechAsync(transcript, config)`

Asynchronously analyzes speech, suitable for longer texts.

#### `processTranscript(transcript)`

Basic processing of speech text.

## Authentication

### `useAuth`

Hook for managing user authentication state and actions.

```typescript
const {
  user,
  isAuthenticated,
  isLoading,
  signIn,
  signUp,
  signOut,
  resetPassword,
  updateProfile
} = useAuth();
```

#### Returns

- `user`: Current user object or null
- `isAuthenticated`: Boolean indicating authentication status
- `isLoading`: Boolean for authentication state loading
- `signIn`: Function to sign in user
- `signUp`: Function to register new user
- `signOut`: Function to log out user
- `resetPassword`: Function to initiate password reset
- `updateProfile`: Function to update user profile

## UI Components

### Chat Components

- `<Chat />`: Main chat interface
- `<ChatInput />`: Text input with voice toggle
- `<ChatMessages />`: Message display area
- `<ChatHeader />`: Header with search and controls

### Practice Components

- `<PracticePageHeader />`: Header for practice page
- `<PracticePageContent />`: Content area for speech practice

### Speech Components

- `<RecordingIndicator />`: Visual indicator for active recording
- `<RecordingTimer />`: Timer display for voice recording
- `<SpeechOccasionSelector />`: Selector for speech scenarios
