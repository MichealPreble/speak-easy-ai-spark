
# SpeakEasyAI Deployment Guide

This document provides instructions for deploying SpeakEasyAI to production.

## Prerequisites

- Supabase account
- Vercel account (or another hosting provider)
- Domain name (optional)

## 1. Supabase Setup

### Create Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Messages table to store chat history
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sender TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_voice_message BOOLEAN DEFAULT FALSE,
  is_feedback BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own messages
CREATE POLICY "Users can access their own messages" 
  ON messages 
  FOR ALL 
  TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Configure Authentication

1. Go to Authentication > Settings in Supabase dashboard
2. Enable Email auth provider
3. Configure any additional providers as needed

## 2. Environment Variables

### Vercel Configuration

Add these environment variables in your Vercel project settings:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Local Development

Create a `.env.local` file (add to .gitignore):

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy

## 4. Domain Setup (Optional)

1. Purchase a domain from a provider
2. In Vercel, go to Settings > Domains
3. Add your custom domain
4. Follow Vercel's instructions to set up DNS

## 5. Post-Deployment Tasks

- Test user authentication flows
- Verify speech recognition works in supported browsers
- Check that voice analysis features work correctly
- Monitor for errors using browser console
- Consider adding error monitoring like Sentry

## Browser Compatibility

SpeakEasyAI's speech recognition features require:
- Chrome or Edge for full functionality
- Non-supported browsers will see fallback UIs

## Troubleshooting

- If speech recognition doesn't work, check HTTPS is enabled
- For authentication issues, verify Supabase configuration
- For database errors, check Row Level Security policies
