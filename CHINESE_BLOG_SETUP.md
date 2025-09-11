# Chinese Blog Data Initialization Guide

## Overview

This project now supports separate statistics for Chinese and English blog posts. To properly display Chinese blog statistics in the admin dashboard, you need to initialize the database with Chinese blog data.

## Step 1: Execute Database Schema Updates

First, manually execute the SQL script in Supabase SQL editor:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Execute the script in `lib/db/init_chinese_blogs.sql`

This script will:

- Add `language` column to `post_stats`, `daily_stats`, and `comments` tables
- Create unique constraints that include language
- Insert Chinese blog statistics data
- Insert sample Chinese comments

## Step 2: Initialize Chinese Blog Data via Admin Interface

After running the SQL script:

1. Go to Admin Dashboard (`/admin/manage`)
2. You'll see a new "Initialize Chinese Blog Data" section
3. Click "Initialize Chinese Data" button
4. This will create statistics for all Chinese blog posts found in `lib/post/zh/`

## Step 3: Verify Data

After initialization, you should see:

### Admin Dashboard

- **Language Statistics**: Chinese Blogs section will show actual data instead of zeros
- **Overall Statistics**: Will include data from both English and Chinese blogs

### Analytics Page

- **Overall Statistics**: Will show combined data including Total Posts count
- **Daily Statistics**: Comments column will display actual data
- **Post Statistics**: Comments column will show correct counts

### Comments Management Page

- Language switcher will work properly
- Chinese posts will appear when "中文" is selected
- Comments will be properly associated with their respective language versions

## Data Structure

The system now maintains separate statistics for:

- **English blogs** (`language: 'en'`)

  - Views, likes, comments, AI questions, AI summaries
  - Located in `lib/post/en/`

- **Chinese blogs** (`language: 'zh'`)
  - Views, likes, comments, AI questions, AI summaries
  - Located in `lib/post/zh/`

## API Changes

The following APIs now support language parameters:

- `/api/stats?language=en|zh&aggregate=all` - Get language-specific statistics
- `/api/admin/analytics` - Returns combined data with proper language handling
- `/api/admin/comments/count` - Returns posts from both languages
- `/api/admin/comments?language=en|zh` - Filter comments by language

## Database Schema Changes

### Tables Updated:

- `post_stats`: Added `language` column, unique constraint on `(post_id, language)`
- `daily_stats`: Added `language` column, unique constraint on `(post_id, date, language)`
- `comments`: Added `language` column for proper language association

### New Constraints:

```sql
-- Ensures each post can have stats for both languages
ALTER TABLE post_stats ADD CONSTRAINT post_stats_post_id_language_unique UNIQUE(post_id, language);

-- Ensures daily stats are tracked separately by language
ALTER TABLE daily_stats ADD CONSTRAINT daily_stats_post_id_date_language_unique UNIQUE(post_id, date, language);
```

## Troubleshooting

If you see zeros in Chinese blog statistics:

1. Check if the SQL script was executed successfully
2. Verify that Chinese blog files exist in `lib/post/zh/`
3. Run the "Initialize Chinese Data" button again
4. Check browser console for any API errors

If comments don't show up:

1. Ensure comments have the correct `language` field in the database
2. Verify the language switcher is working in Comments Management
3. Check if sample Chinese comments were inserted via the SQL script
