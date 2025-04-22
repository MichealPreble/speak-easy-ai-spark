
# SpeakEasyAI Architecture Overview

This document provides a high-level overview of the SpeakEasyAI architecture, explaining how different components interact and the overall system design.

## System Architecture

SpeakEasyAI follows a modern frontend architecture built with React and TypeScript, using Vite as the build tool. The application utilizes Supabase for backend services like authentication and data storage.

### Key Components

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                       SpeakEasyAI Client                       │
│                                                                │
├────────────┬────────────┬────────────────┬────────────────────┤
│            │            │                │                    │
│  Chat      │  Voice     │  Speech        │  User              │
│  System    │  System    │  Analysis      │  Management        │
│            │            │                │                    │
└────┬───────┴─────┬──────┴────────┬───────┴──────────┬─────────┘
     │             │               │                  │
     │             │               │                  │
     │             │               │                  │
┌────▼─────────────▼───────────────▼──────────────────▼─────────┐
│                                                                │
│                       Supabase Backend                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Client-Side Components

### Core Modules

1. **Chat System**
   - Manages message display, input, and interactions
   - Handles message history and search functionality
   - Implements conversation summarization

2. **Voice System**
   - Integrates with Web Speech API
   - Manages recording state and audio processing
   - Provides real-time feedback during recording

3. **Speech Analysis**
   - Processes speech transcripts
   - Analyzes speech patterns, hesitations, and cadence
   - Generates quality scores and improvement suggestions

4. **User Management**
   - Handles authentication flows
   - Manages user profiles and preferences
   - Stores user-specific settings and history

### State Management

SpeakEasyAI uses a combination of React hooks and context for state management:

- **Local Component State**: Used for UI-specific state within components
- **Custom Hooks**: Encapsulate reusable logic and state management
- **Context API**: Provides global state for themes, authentication, etc.

## Data Flow

1. **User Input Flow**
   ```
   User Input → Voice Recognition → Transcript → Speech Analysis → UI Feedback
   ```

2. **Chat Message Flow**
   ```
   User Message → Message Processing → Storage → AI Response → UI Update
   ```

3. **Authentication Flow**
   ```
   Login Form → Auth Request → Supabase Auth → JWT Token → Auth Context Update
   ```

## Key Technologies

### Frontend

- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: UI component library based on Radix UI
- **Vite**: Build tool and development server
- **React Router**: Client-side routing

### Backend Services (via Supabase)

- **Authentication**: User management and secure sessions
- **Database**: PostgreSQL for data storage
- **Row Level Security**: Data access control
- **Functions**: Serverless functions for business logic

### Speech Processing

- **Web Speech API**: Browser-native speech recognition
- **Custom Algorithms**: Proprietary speech analysis logic
- **Audio Processing**: Real-time audio feature extraction

## Code Organization

```
src/
├── components/         # UI components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   ├── landing/        # Landing page components
│   ├── practice/       # Practice page components 
│   ├── speech/         # Speech-related components
│   └── ui/             # Reusable UI components
├── context/            # React context providers
├── data/               # Static data and constants
├── hooks/              # Custom React hooks
│   ├── chat/           # Chat-related hooks
│   ├── speech/         # Speech-related hooks
│   └── voice/          # Voice recognition hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── services/           # External service integrations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
    └── speech/         # Speech analysis utilities
```

## Performance Considerations

1. **Lazy Loading**
   - Page components are loaded on-demand
   - Heavy speech analysis algorithms are loaded when needed

2. **Caching**
   - Speech analysis results are cached
   - Message history uses efficient storage

3. **Web Workers**
   - Intensive processing can be offloaded to web workers
   - Keeps UI responsive during analysis

## Security Considerations

1. **Authentication**
   - JWT-based authentication via Supabase
   - Secure password hashing and storage

2. **Data Access**
   - Row-level security policies in Supabase
   - Client-side access controls

3. **Input Validation**
   - All user inputs are validated
   - Protection against XSS and injection attacks

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  GitHub         │────▶│  Vercel         │────▶│  CDN            │
│  Repository     │     │  Build Pipeline │     │  Edge Network   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Supabase       │
                        │  Services       │
                        │                 │
                        └─────────────────┘
```

The application is deployed using Vercel for the frontend and Supabase for backend services, providing a scalable, globally distributed architecture.
