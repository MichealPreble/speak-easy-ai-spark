-- Initial schema for SpeakEasyAI
-- Run this in your Supabase SQL editor

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

-- Add indexes for common queries
CREATE INDEX idx_messages_user_id ON messages (user_id);
CREATE INDEX idx_messages_timestamp ON messages (timestamp DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own messages
CREATE POLICY "Users can access their own messages" 
  ON messages 
  FOR ALL 
  TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Optional: User profiles table for additional user data
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own profile
CREATE POLICY "Users can access their own profile" 
  ON user_profiles 
  FOR ALL 
  TO authenticated 
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Optional: Speech metrics table for storing analysis results
CREATE TABLE speech_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  pitch_variation NUMERIC,
  volume_variation NUMERIC, 
  speaking_rate NUMERIC,
  filler_words JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE speech_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own speech metrics
CREATE POLICY "Users can access their own speech metrics" 
  ON speech_metrics 
  FOR ALL 
  TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Favorites table to store user's favorite speech occasions
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, occasion_name)
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own favorites
CREATE POLICY "Users can access their own favorites" 
  ON favorites 
  FOR ALL 
  TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add index for common queries
CREATE INDEX idx_favorites_user_id ON favorites (user_id);
