
-- Add practice_feedback column to practice_sessions table 
ALTER TABLE practice_sessions 
ADD COLUMN practice_feedback INTEGER CHECK (practice_feedback >= 1 AND practice_feedback <= 5);
