-- Backup SQL for all tables in Supabase
-- Run this in your Supabase SQL editor to backup data

-- Backup feature_toggles table
-- SELECT * FROM feature_toggles;

-- Backup comments table
-- SELECT * FROM comments;

-- Backup post_stats table
-- SELECT * FROM post_stats;

-- Backup daily_stats table
-- SELECT * FROM daily_stats;

-- To create a backup, you can use the Supabase dashboard or run:
-- pg_dump -h [host] -p [port] -U [user] -d [database] -t feature_toggles -t comments -t post_stats -t daily_stats > backup.sql