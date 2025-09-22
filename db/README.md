# Database Scripts

This directory contains two essential SQL scripts for managing the NZMarie blog database:

## 1. reset_and_update_all_nzmarie_posts.sql

**Purpose**: Completely reset and reinitialize all NZMarie blog posts with minimal metadata.
**When to use**: When you need to clear all existing NZMarie content and start fresh.

**Key features**:

- Deletes all existing NZMarie posts and related data
- Re-inserts posts with placeholder content
- Updates post statistics
- Fixes database constraints to ensure consistency

## 2. init_nzmarie_final.sql

**Purpose**: Initialize or update NZMarie blog data without removing existing content.
**When to use**: For initial setup or when adding new posts while preserving existing data.

**Key features**:

- Safely adds new posts without affecting existing ones
- Updates post statistics with proper conflict handling
- Adds sample comments for both languages
- Sets up daily statistics
- Fixes database constraints to ensure consistency
- Includes verification queries at the end

## Database Constraint Fix

Both scripts now include commands to fix database constraints:

- Remove old constraint: `post_stats_post_id_key`
- Ensure new constraint exists: `post_stats_post_id_language_key` (UNIQUE constraint on post_id and language)

This fix resolves issues with comment submission on multilingual posts and ensures proper data consistency.

## Usage Instructions

1. Execute these scripts in the Supabase SQL editor
2. The init_nzmarie_final.sql script is safe to run multiple times
3. The reset_and_update_all_nzmarie_posts.sql script will delete all existing NZMarie data

## Recent Updates

- Added database constraint fix to ensure proper handling of multilingual posts
- Improved conflict handling in all INSERT statements
- Added comments field to post_stats table initialization
