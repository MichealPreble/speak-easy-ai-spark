
# SpeakEasyAI

[![MVP Testing Status](https://img.shields.io/badge/MVP%20Testing-In%20Progress-yellow?style=flat-square&logo=checkmarx)](docs/mvp-testing-codex.md)

SpeakEasyAI is an AI-powered conversation assistant with voice recognition, message summarization, and markdown formatting capabilities.

## Features

- 💬 Chat interface with AI assistant
- 🎤 Voice messaging support
- 📝 Markdown formatting for messages
- 🔍 Message search functionality
- 🌓 Dark/light mode toggle
- 📊 Conversation summarization
- ⌨️ Keyboard shortcuts

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/speakeasyai.git
   cd speakeasyai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Deployment

### Deploying to Vercel

1. Push your code to GitHub

2. Visit [Vercel](https://vercel.com) and create a new project from your GitHub repository

3. Follow the Vercel setup wizard, keeping the default settings

4. Click "Deploy" and wait for the build to complete

5. Your app is now live at the URL provided by Vercel!

## User Guide

- **Chat**: Type a message in the text box and press Enter or click the send button
- **Voice Input**: Click the microphone icon or press Ctrl+V to start recording a voice message
- **Search**: Type in the search box to filter messages
- **Theme**: Toggle between light and dark mode using the sun/moon icon
- **Summarize**: Click the book icon or press Ctrl+S to get a summary of your conversation
- **Clear Chat**: Click the trash icon to clear all messages

## Tech Stack

- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Vite

## Browser Support

- Chrome (recommended for full feature support including voice)
- Firefox
- Safari
- Edge

## License

This project is licensed under the MIT License - see the LICENSE file for details.
