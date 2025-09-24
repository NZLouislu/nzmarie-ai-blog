# NZMarie Blog Data Initialization Guide

## Overview

This guide explains how to properly initialize and set up the NZMarie blog with all necessary data for statistics, comments, and user management. The script is designed to work alongside existing data (such as NZLouis's data) without affecting it.

## Step 1: Fix Database Migration Issues

Before initializing the data, you need to ensure the database schema is correctly set up:

1. Run `npx prisma migrate reset --force` to reset and reapply all migrations
2. This will fix the "no such column: postId" error that was occurring in the previous migration
3. This will also fix the incorrect `daily_stats` table structure that had `post_id` column instead of `userId`

## Step 2: Execute Database Schema Updates

After fixing the migration issues, manually execute the SQL script in Supabase SQL editor:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Execute the script in `lib/db/init_nzmarie_supabase_fixed.sql`

This script will:

- Clean up all existing NZMarie data to ensure a clean initialization
- Add `language` column to `post_stats`, `daily_stats`, and `comments` tables (if not already present)
- Create unique constraints that include language
- Insert NZMarie blog statistics data for both English and Chinese posts
- Insert sample comments for both languages
- Set up the NZMarie user account
- Associate only NZMarie's posts with her user account (will not affect existing NZLouis data)

Note: The Supabase database structure is slightly different from the local SQLite database. In Supabase:

- `daily_stats` table uses `post_id` column instead of `userId` column
- Constraints are named differently

## Step 3: Initialize Blog Data via Admin Interface

After running the SQL script:

1. Go to Admin Dashboard (`/admin/manage`)
2. You'll see the updated "Initialize Blog Data" section
3. Click "Initialize Chinese Data" button
4. Click "Initialize English Data" button
5. This will create statistics for all blog posts found in `lib/post/zh/` and `lib/post/en/`

## Step 4: Verify Data

After initialization, you should see:

### Admin Dashboard

- **Language Statistics**: Both English and Chinese Blogs sections will show actual data
- **Overall Statistics**: Will include data from both English and Chinese blogs
- **Posts Count**: Will show the correct number of posts in each language

### Analytics Page

- **Overall Statistics**: Will show combined data including Total Posts count
- **Daily Statistics**: Comments column will display actual data
- **Post Statistics**: Comments column will show correct counts

### Comments Management Page

- Language switcher will work properly
- Posts will appear when the respective language is selected
- Comments will be properly associated with their respective language versions

## Data Structure

The system now maintains separate statistics for:

- **English blogs** (`language: 'en'`)

  - Located in `lib/post/en/`
  - Views, likes, comments, AI questions, AI summaries

- **Chinese blogs** (`language: 'zh'`)

  - Located in `lib/post/zh/`
  - Views, likes, comments, AI questions, AI summaries

## API Changes

The following APIs now support language parameters:

- `/api/stats?language=en|zh&aggregate=all` - Get language-specific statistics
- `/api/admin/analytics` - Returns combined data with proper language handling
- `/api/admin/comments/count` - Returns posts from both languages
- `/api/admin/comments?language=en|zh` - Filter comments by language

## Database Schema Changes

### Tables Updated:

- `post_stats`: Added `language` column, unique constraint on `("post_id", "language")`
- `daily_stats`: Added `language` column, unique constraint on `("userId", "date", "language")`
- `comments`: Added `language` column for proper language association
- `users`: Updated NZMarie user information

### New Constraints:

```sql
-- Ensures each post can have stats for both languages
ALTER TABLE post_stats ADD CONSTRAINT post_stats_post_id_language_unique UNIQUE("post_id", "language");

-- Ensures daily stats are tracked separately by language per user
ALTER TABLE daily_stats ADD CONSTRAINT daily_stats_userId_date_language_key UNIQUE("userId", "date", "language");
```

## Troubleshooting

If you see zeros in blog statistics:

1. Check if the SQL script was executed successfully
2. Verify that blog files exist in `lib/post/en/` and `lib/post/zh/`
3. Run the "Initialize Blog Data" buttons again
4. Check browser console for any API errors

If comments don't show up:

1. Ensure comments have the correct `language` field in the database
2. Verify the language switcher is working in Comments Management
3. Check if sample comments were inserted via the SQL script

## NZMarie User Information

The NZMarie user is configured with:

- **ID**: `nzmarie`
- **Name**: `Marie Nian`
- **Email**: `marie@ssrealty.co.nz`
- **Role**: `user`
- **Language Preferences**: `both` (English and Chinese)

Only NZMarie's blog posts (identified by their specific slugs) are associated with this user account. Existing data from other users (like NZLouis) will remain unaffected. The script has been specifically updated to ensure it only updates posts belonging to NZMarie, preserving all existing data.
