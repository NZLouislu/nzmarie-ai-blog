-- Backup SQL for all tables in Supabase
-- Run this in your Supabase SQL editor to backup data

-- Create backup directory (if running locally)
-- mkdir -p ./backups

-- Backup feature_toggles table
SELECT 'feature_toggles' as table_name, json_agg(row_to_json(feature_toggles)) as data
FROM feature_toggles
UNION ALL

-- Backup comments table
SELECT 'comments' as table_name, json_agg(row_to_json(comments)) as data
FROM comments
UNION ALL

-- Backup post_stats table
SELECT 'post_stats' as table_name, json_agg(row_to_json(post_stats)) as data
FROM post_stats
UNION ALL

-- Backup daily_stats table
SELECT 'daily_stats' as table_name, json_agg(row_to_json(daily_stats)) as data
FROM daily_stats;

-- Alternative: Export to CSV format
-- COPY feature_toggles TO './backups/feature_toggles_backup.csv' WITH CSV HEADER;
-- COPY comments TO './backups/comments_backup.csv' WITH CSV HEADER;
-- COPY post_stats TO './backups/post_stats_backup.csv' WITH CSV HEADER;
-- COPY daily_stats TO './backups/daily_stats_backup.csv' WITH CSV HEADER;

-- Alternative: Full database backup using pg_dump
-- pg_dump -h [your-supabase-host] -p 5432 -U postgres -d postgres -t feature_toggles -t comments -t post_stats -t daily_stats --no-owner --no-privileges > ./backups/blog_database_backup.sql

-- To restore from backup:
-- psql -h [your-supabase-host] -p 5432 -U postgres -d postgres < ./backups/blog_database_backup.sql

-- Note: Replace [your-supabase-host] with your actual Supabase database host
-- You can find the connection details in your Supabase project settings