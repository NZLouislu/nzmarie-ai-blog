-- SQL to create feature_toggles table in Supabase
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS feature_toggles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_views BOOLEAN DEFAULT true,
  total_likes BOOLEAN DEFAULT true,
  total_comments BOOLEAN DEFAULT true,
  ai_summaries BOOLEAN DEFAULT true,
  ai_questions BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feature_toggles DISABLE ROW LEVEL SECURITY;

-- Insert default values
INSERT INTO feature_toggles (total_views, total_likes, total_comments, ai_summaries, ai_questions)
VALUES (true, true, true, true, true)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger (drop if exists first)
DROP TRIGGER IF EXISTS update_feature_toggles_updated_at ON feature_toggles;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_toggles_updated_at
    BEFORE UPDATE ON feature_toggles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();