
# SpeakEasyAI

[![MVP Testing Status](https://img.shields.io/badge/MVP%20Testing-In%20Progress-yellow?style=flat-square&logo=checkmarx&logoColor=white)](./docs/mvp-testing-codex.md)
[![Build Status](https://github.com/AI-Collaborator/Awesome-Project/actions/workflows/test.yml/badge.svg?style=flat-square)](https://github.com/AI-Collaborator/Awesome-Project/actions/workflows/test.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/AI-Collaborator/Awesome-Project/main?style=flat-square&logo=codecov&logoColor=white)](https://codecov.io/gh/AI-Collaborator/Awesome-Project)
[![Version](https://img.shields.io/github/v/release/AI-Collaborator/Awesome-Project?style=flat-square)](https://github.com/AI-Collaborator/Awesome-Project/releases)
[![Deployment Status](https://vercelbadge.vercel.app/api/AI-Collaborator/awesome-project-web?style=flat-square)](https://awesome-project-web-git-main-ai-collaborator.vercel.app)

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
   git clone https://github.com/AI-Collaborator/Awesome-Project.git
   cd Awesome-Project
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

## Documentation

For more detailed information, check out our documentation:

- [Getting Started Guide](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Examples](./docs/examples.md)
- [Architecture Overview](./docs/architecture.md)

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
