# NZMarie Posts Update Instructions

## Overview

This document explains how to reset and update NZMarie's posts in the database with minimal metadata while keeping the full content in Markdown files.

## Files Created

1. `reset_and_update_nzmarie_posts.sql` - Basic script for a few posts
2. `reset_and_update_all_nzmarie_posts.sql` - Complete script for all NZMarie posts
3. Updated `lib/posts.ts` with new `getNZMariePosts` function

## Execution Steps

### Step 1: Execute the SQL Script

Run one of the SQL scripts in your Supabase SQL editor:

For a basic update:

```sql
-- Execute the contents of reset_and_update_nzmarie_posts.sql
```

For a complete update:

```sql
-- Execute the contents of reset_and_update_all_nzmarie_posts.sql
```

### Step 2: Verify the Changes

Check that the posts table now contains only minimal metadata for NZMarie's posts:

- id (now the same as slug for consistency)
- authorId (should be 'nzmarie')
- slug
- title
- language
- status
- publishedAt
- tags
- createdAt
- updatedAt

Note that the `content` column is no longer stored in the database.

### Step 3: Test the Blog

Verify that the blog still works correctly:

1. Articles should load properly (content from .md files)
2. Statistics should work (data from database)
3. Comments should work (data from database)
4. Both English and Chinese versions should be accessible

## Key Changes

### Database Structure

- Removed `content` column from `posts` table
- Posts table now only stores metadata needed for linking and statistics
- **ID field is now the same as slug for consistency** (English posts use the slug directly, Chinese posts use slug with "-zh" suffix)
- Full article content continues to be read from Markdown files

### Code Changes

- Added `getNZMariePosts` function to filter posts by author
- Maintained all existing functionality for reading content from .md files
- Preserved statistics and comment functionality

## Benefits

1. **Reduced Database Size**: No longer storing large text content in database
2. **Better Performance**: Smaller database records
3. **Maintained Functionality**: All existing features continue to work
4. **Easier Maintenance**: Content updates only require changing Markdown files
5. **Language Support**: Both English and Chinese versions properly supported
6. **Consistent IDs**: ID field now matches slug for easier identification

## Notes

- The system will continue to read full article content from Markdown files in `lib/post/en/` and `lib/post/zh/`
- Database only stores minimal metadata for linking, statistics, and comments
- All existing API routes and frontend components should work without changes
- Statistics and comments are still stored in the database and associated with post IDs
- **ID consistency**: English posts use the slug as ID, Chinese posts use the slug with "-zh" suffix to ensure uniqueness
