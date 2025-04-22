
# SpeakEasyAI: Getting Started Guide

## Introduction

SpeakEasyAI is a modern web application that provides an AI-powered conversation assistant with advanced features including:

- 💬 Real-time chat interface with AI responses
- 🎤 Voice recognition for hands-free interaction
- 📝 Markdown formatting for structured messages
- 🔍 Powerful message search functionality
- 🌓 Dark/light mode for different environments
- 📊 Automatic conversation summarization
- ⌨️ Convenient keyboard shortcuts

This guide will help you set up your development environment and start using SpeakEasyAI on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A modern web browser (Chrome recommended for full speech recognition support)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AI-Collaborator/Awesome-Project.git
   cd Awesome-Project
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory by copying the template:

   ```bash
   cp .env.template .env
   ```

   Then update the Supabase credentials in the `.env` file:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Basic Usage

### Chat Interface

The main interface allows you to:
- Type messages in the input box
- Press Enter or click the send button to submit
- See AI responses in real-time with typing indicators

### Voice Recognition

To use voice recognition:
1. Click the microphone icon or press `Ctrl+V`
2. Speak clearly into your microphone
3. The app will automatically transcribe your speech and generate a response
4. You'll receive feedback on your speech patterns (pace, clarity, etc.)

### Message Search

To search through previous messages:
1. Click the search icon in the chat header
2. Type your search query
3. Results will be filtered in real-time

### Dark/Light Mode

Toggle between dark and light modes by clicking the sun/moon icon in the header.

### Conversation Summary

Generate a summary of your conversation by:
1. Clicking the book icon in the chat header
2. Or pressing `Ctrl+S`

## Core Components

SpeakEasyAI consists of several key components:

- **Chat**: Handles message display and interaction
- **Voice Recognition**: Processes speech input through browser APIs
- **Speech Analysis**: Analyzes speech patterns and provides feedback
- **User Authentication**: Manages user sessions and profiles
- **Theme Management**: Controls application appearance

## Troubleshooting

### Voice Recognition Issues

If voice recognition isn't working:
- Ensure you've granted microphone permissions
- Try using Chrome or Edge browsers for best compatibility
- Check that your microphone is working in other applications

### Authentication Problems

If you encounter authentication issues:
- Verify your Supabase credentials in the `.env` file
- Check browser console for specific error messages
- Ensure your Supabase project has the correct authentication settings

## Next Steps

- Explore the [API Reference](./api-reference.md) for detailed information on all components
- Check out [Example Use Cases](./examples.md) for inspiration
- Review the [Architecture Overview](./architecture.md) to understand how the system works

## Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details on how to get started.
