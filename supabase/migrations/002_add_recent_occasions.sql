
-- Create a table for tracking recently viewed speech occasions
CREATE TABLE recent_occasions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    occasion_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, occasion_name)
);

-- Enable Row Level Security
ALTER TABLE recent_occasions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own recent occasions
CREATE POLICY "Users can access their own recent occasions" 
    ON recent_occasions 
    FOR ALL 
    TO authenticated 
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Add index for common queries
CREATE INDEX idx_recent_occasions_user_id ON recent_occasions (user_id);
CREATE INDEX idx_recent_occasions_created_at ON recent_occasions (created_at DESC);
