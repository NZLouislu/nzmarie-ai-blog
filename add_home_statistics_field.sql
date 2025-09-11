-- Add home_statistics field to existing feature_toggles table
-- This is a safe migration script that adds the missing field

-- Check if the column exists, if not add it
DO $$
BEGIN
    -- Try to add the column if it doesn't exist
    BEGIN
        ALTER TABLE feature_toggles ADD COLUMN home_statistics BOOLEAN DEFAULT true;
    EXCEPTION
        WHEN duplicate_column THEN
            -- Column already exists, do nothing
            RAISE NOTICE 'Column home_statistics already exists';
    END;
END $$;

-- Update any existing records to have home_statistics = true
UPDATE feature_toggles SET home_statistics = true WHERE home_statistics IS NULL;