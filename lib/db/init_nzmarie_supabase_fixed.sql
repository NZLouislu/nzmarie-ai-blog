-- Initialize NZMarie blog data in the Supabase database
-- Execute this script in Supabase SQL editor manually

-- 1. First, clean up all existing data related to nzmarie to ensure clean initialization
-- Delete post_stats entries for NZMarie's posts
DELETE FROM post_stats WHERE "post_id" IN (
  SELECT id FROM posts WHERE "authorId" = 'nzmarie'
);

-- Delete daily_stats entries for NZMarie's posts
-- Note: In Supabase database, daily_stats table may contain post_id field instead of userId field
DELETE FROM daily_stats WHERE "post_id" IN (
  SELECT id FROM posts WHERE "authorId" = 'nzmarie'
);

-- Delete comments for NZMarie's posts
DELETE FROM comments WHERE "postId" IN (
  SELECT id FROM posts WHERE "authorId" = 'nzmarie'
);

-- Update existing posts to remove association with nzmarie
UPDATE posts 
SET "authorId" = 'admin' 
WHERE "authorId" = 'nzmarie';

-- 2. Safely add missing columns to tables
-- Add avatarUrl column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'avatarUrl') THEN
        ALTER TABLE users ADD COLUMN "avatarUrl" TEXT;
    END IF;
END $$;

-- Add language column to tables if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'post_stats' AND column_name = 'language') THEN
        ALTER TABLE post_stats ADD COLUMN "language" TEXT DEFAULT 'en';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'daily_stats' AND column_name = 'language') THEN
        ALTER TABLE daily_stats ADD COLUMN "language" TEXT DEFAULT 'en';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'comments' AND column_name = 'language') THEN
        ALTER TABLE comments ADD COLUMN "language" TEXT DEFAULT 'en';
    END IF;
END $$;

-- 3. Update existing data to be marked as English
UPDATE post_stats SET "language" = 'en' WHERE "language" IS NULL OR "language" = '';
UPDATE daily_stats SET "language" = 'en' WHERE "language" IS NULL OR "language" = '';
UPDATE comments SET "language" = 'en' WHERE "language" IS NULL OR "language" = '';

-- 4. Handle constraints safely
-- Drop conflicting constraints if they exist
DO $$ 
BEGIN
    -- Drop the old unique constraint on post_id only if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'post_stats_post_id_key' 
               AND table_name = 'post_stats') THEN
        ALTER TABLE post_stats DROP CONSTRAINT post_stats_post_id_key;
    END IF;
    
    -- Drop the new unique constraint if it exists (to avoid duplicate)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'post_stats_post_id_language_unique' 
               AND table_name = 'post_stats') THEN
        ALTER TABLE post_stats DROP CONSTRAINT post_stats_post_id_language_unique;
    END IF;
    
    -- Drop daily_stats old constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'daily_stats_post_id_date_key' 
               AND table_name = 'daily_stats') THEN
        ALTER TABLE daily_stats DROP CONSTRAINT daily_stats_post_id_date_key;
    END IF;
    
    -- Drop daily_stats new constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'daily_stats_userId_date_language_key' 
               AND table_name = 'daily_stats') THEN
        ALTER TABLE daily_stats DROP CONSTRAINT daily_stats_userId_date_language_key;
    END IF;
    
    -- Drop daily_stats post_id constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'daily_stats_post_id_language_key' 
               AND table_name = 'daily_stats') THEN
        ALTER TABLE daily_stats DROP CONSTRAINT daily_stats_post_id_language_key;
    END IF;
END $$;

-- 5. Insert or update NZMarie user
INSERT INTO users (id, email, name, role, "avatarUrl", "languagePreferences", "createdAt", "updatedAt") VALUES
('nzmarie', 'marie@nzrealestate.co.nz', 'Marie Hong', 'user', '/images/authors/marie.jpg', 'both', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "languagePreferences" = EXCLUDED."languagePreferences",
  "updatedAt" = NOW();

-- Update existing posts to associate with NZMarie (only for NZMarie's posts)
UPDATE posts 
SET "authorId" = 'nzmarie' 
WHERE slug IN (
  'buying-property-new-zealand-complete-guide',
  'first-home-buyer-financing-guide-new-zealand',
  'maximizing-property-investment-returns-new-zealand',
  'navigating-legal-aspects-property-purchase-new-zealand',
  'new-zealand-property-investment-guide-australian-expats',
  'new-zealand-property-market-trends-2024',
  'retirement-planning-new-zealand-property-owners',
  'selling-your-home-new-zealand-step-by-step',
  'understanding-body-corporate-apartment-owners-new-zealand'
);

-- 6. Insert NZMarie blog post statistics with proper conflict handling
-- English posts
INSERT INTO post_stats ("post_id", title, views, likes, "ai_questions", "ai_summaries", "language") 
SELECT p.id, ps.title, ps.views, ps.likes, ps."ai_questions", ps."ai_summaries", ps."language"
FROM (
  SELECT 
    'buying-property-new-zealand-complete-guide' as slug,
    'Your Complete Guide to Buying Property in New Zealand' as title,
    180 as views, 30 as likes, 12 as "ai_questions", 18 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'first-home-buyer-financing-guide-new-zealand' as slug,
    'First Home Buyer Financing Guide for New Zealand' as title,
    120 as views, 20 as likes, 6 as "ai_questions", 10 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'maximizing-property-investment-returns-new-zealand' as slug,
    'Maximizing Property Investment Returns in New Zealand' as title,
    100 as views, 18 as likes, 6 as "ai_questions", 9 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'navigating-legal-aspects-property-purchase-new-zealand' as slug,
    'Navigating the Legal Aspects of Property Purchase in New Zealand' as title,
    95 as views, 15 as likes, 5 as "ai_questions", 8 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'new-zealand-property-investment-guide-australian-expats' as slug,
    'New Zealand Property Investment Guide for Australian Expats' as title,
    65 as views, 8 as likes, 2 as "ai_questions", 3 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'new-zealand-property-market-trends-2024' as slug,
    'New Zealand Property Market Trends 2024: What You Need to Know' as title,
    140 as views, 22 as likes, 8 as "ai_questions", 12 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'retirement-planning-new-zealand-property-owners' as slug,
    'Retirement Planning for New Zealand Property Owners' as title,
    75 as views, 10 as likes, 2 as "ai_questions", 4 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'selling-your-home-new-zealand-step-by-step' as slug,
    'Selling Your Home in New Zealand: A Step-by-Step Guide for Homeowners' as title,
    160 as views, 25 as likes, 10 as "ai_questions", 14 as "ai_summaries", 'en' as "language"
  UNION ALL
  SELECT 
    'understanding-body-corporate-apartment-owners-new-zealand' as slug,
    'Understanding Body Corporate for Apartment Owners in New Zealand' as title,
    80 as views, 12 as likes, 3 as "ai_questions", 6 as "ai_summaries", 'en' as "language"
) ps
JOIN posts p ON p.slug = ps.slug AND p."authorId" = 'nzmarie' AND p."language" = 'en'
ON CONFLICT ("post_id", "language") DO UPDATE SET
  title = EXCLUDED.title,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  "ai_questions" = EXCLUDED."ai_questions",
  "ai_summaries" = EXCLUDED."ai_summaries";

-- Chinese posts
INSERT INTO post_stats ("post_id", title, views, likes, "ai_questions", "ai_summaries", "language") 
SELECT p.id, ps.title, ps.views, ps.likes, ps."ai_questions", ps."ai_summaries", ps."language"
FROM (
  SELECT 
    'buying-property-new-zealand-complete-guide' as slug,
    '在新西兰购房完整指南' as title,
    180 as views, 30 as likes, 12 as "ai_questions", 18 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'first-home-buyer-financing-guide-new-zealand' as slug,
    '新西兰首次购房者融资指南' as title,
    120 as views, 20 as likes, 6 as "ai_questions", 10 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'maximizing-property-investment-returns-new-zealand' as slug,
    '最大化新西兰房地产投资回报' as title,
    100 as views, 18 as likes, 6 as "ai_questions", 9 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'navigating-legal-aspects-property-purchase-new-zealand' as slug,
    '了解新西兰购房的法律问题' as title,
    95 as views, 15 as likes, 5 as "ai_questions", 8 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'new-zealand-property-investment-guide-australian-expats' as slug,
    '新西兰房地产投资指南：澳洲居民版' as title,
    65 as views, 8 as likes, 2 as "ai_questions", 3 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'new-zealand-property-market-trends-2024' as slug,
    '2024年新西兰房地产市场趋势：您需要了解的内容' as title,
    140 as views, 22 as likes, 8 as "ai_questions", 12 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'retirement-planning-new-zealand-property-owners' as slug,
    '新西兰房产所有者的退休规划' as title,
    75 as views, 10 as likes, 2 as "ai_questions", 4 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'selling-your-home-new-zealand-step-by-step' as slug,
    '在新西兰出售房产：房主分步指南' as title,
    160 as views, 25 as likes, 10 as "ai_questions", 14 as "ai_summaries", 'zh' as "language"
  UNION ALL
  SELECT 
    'understanding-body-corporate-apartment-owners-new-zealand' as slug,
    '了解新西兰公寓业主的业主立案法团' as title,
    80 as views, 12 as likes, 3 as "ai_questions", 6 as "ai_summaries", 'zh' as "language"
) ps
JOIN posts p ON p.slug = ps.slug AND p."authorId" = 'nzmarie' AND p."language" = 'zh'
ON CONFLICT ("post_id", "language") DO UPDATE SET
  title = EXCLUDED.title,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  "ai_questions" = EXCLUDED."ai_questions",
  "ai_summaries" = EXCLUDED."ai_summaries";

-- 7. Insert daily statistics with proper conflict handling
-- First, delete existing data for today to avoid conflicts
-- Note: In Supabase database, daily_stats table uses post_id instead of userId
DELETE FROM daily_stats WHERE "post_id" IN (
  SELECT id FROM posts WHERE "authorId" = 'nzmarie'
);

-- Delete duplicate data, keeping only the first record of each (post_id, language) group
DELETE FROM daily_stats a
WHERE a.ctid <> (
  SELECT min(b.ctid)
  FROM daily_stats b
  WHERE a."post_id" = b."post_id" AND a."language" = b."language"
);

-- Then insert daily stats for each post individually to ensure all fields are set
-- English posts
INSERT INTO daily_stats (id, "post_id", date, "pageViews", likes, "ai_questions", "ai_summaries", "language", "uniqueVisitors", reads, comments)
SELECT 
  gen_random_uuid() as id,
  p.id as "post_id",
  CURRENT_DATE as date,
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 18
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 12
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 10
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 9
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 6
    WHEN 'new-zealand-property-market-trends-2024' THEN 14
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 7
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 16
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 8
    ELSE 5
  END as "pageViews",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 3
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 2
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 1
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 1
    WHEN 'new-zealand-property-market-trends-2024' THEN 2
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 1
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 2
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 1
    ELSE 1
  END as likes,
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 2
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 1
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 0
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 0
    WHEN 'new-zealand-property-market-trends-2024' THEN 1
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 0
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 1
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 0
    ELSE 0
  END as "ai_questions",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 3
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 1
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 1
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 1
    WHEN 'new-zealand-property-market-trends-2024' THEN 2
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 1
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 2
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 1
    ELSE 1
  END as "ai_summaries",
  'en' as "language",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 15
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 10
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 8
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 7
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 5
    WHEN 'new-zealand-property-market-trends-2024' THEN 12
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 6
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 14
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 7
    ELSE 5
  END as "uniqueVisitors",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 10
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 8
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 6
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 5
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 4
    WHEN 'new-zealand-property-market-trends-2024' THEN 9
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 4
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 11
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 5
    ELSE 5
  END as reads,
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 2
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 1
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 0
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 0
    WHEN 'new-zealand-property-market-trends-2024' THEN 1
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 0
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 2
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 1
    ELSE 0
  END as comments
FROM posts p 
WHERE p."authorId" = 'nzmarie' AND p."language" = 'en'
ON CONFLICT ("post_id", "language") DO UPDATE SET
  date = EXCLUDED.date,
  "pageViews" = EXCLUDED."pageViews",
  likes = EXCLUDED.likes,
  "ai_questions" = EXCLUDED."ai_questions",
  "ai_summaries" = EXCLUDED."ai_summaries",
  "uniqueVisitors" = EXCLUDED."uniqueVisitors",
  reads = EXCLUDED.reads,
  comments = EXCLUDED.comments;

-- Chinese posts
INSERT INTO daily_stats (id, "post_id", date, "pageViews", likes, "ai_questions", "ai_summaries", "language", "uniqueVisitors", reads, comments)
SELECT 
  gen_random_uuid() as id,
  p.id as "post_id",
  CURRENT_DATE as date,
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 18
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 12
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 10
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 9
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 6
    WHEN 'new-zealand-property-market-trends-2024' THEN 14
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 7
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 16
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 8
    ELSE 5
  END as "pageViews",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 3
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 2
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 1
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 1
    WHEN 'new-zealand-property-market-trends-2024' THEN 2
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 1
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 2
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 1
    ELSE 1
  END as likes,
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 2
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 1
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 0
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 0
    WHEN 'new-zealand-property-market-trends-2024' THEN 1
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 0
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 1
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 0
    ELSE 0
  END as "ai_questions",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 3
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 1
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 1
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 1
    WHEN 'new-zealand-property-market-trends-2024' THEN 2
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 1
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 2
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 1
    ELSE 1
  END as "ai_summaries",
  'zh' as "language",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 15
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 10
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 8
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 7
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 5
    WHEN 'new-zealand-property-market-trends-2024' THEN 12
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 6
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 14
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 7
    ELSE 5
  END as "uniqueVisitors",
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 10
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 8
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 6
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 5
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 4
    WHEN 'new-zealand-property-market-trends-2024' THEN 9
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 4
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 11
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 5
    ELSE 5
  END as reads,
  CASE p.slug
    WHEN 'buying-property-new-zealand-complete-guide' THEN 2
    WHEN 'first-home-buyer-financing-guide-new-zealand' THEN 1
    WHEN 'maximizing-property-investment-returns-new-zealand' THEN 1
    WHEN 'navigating-legal-aspects-property-purchase-new-zealand' THEN 0
    WHEN 'new-zealand-property-investment-guide-australian-expats' THEN 0
    WHEN 'new-zealand-property-market-trends-2024' THEN 1
    WHEN 'retirement-planning-new-zealand-property-owners' THEN 0
    WHEN 'selling-your-home-new-zealand-step-by-step' THEN 2
    WHEN 'understanding-body-corporate-apartment-owners-new-zealand' THEN 1
    ELSE 0
  END as comments
FROM posts p 
WHERE p."authorId" = 'nzmarie' AND p."language" = 'zh'
ON CONFLICT ("post_id", "language") DO UPDATE SET
  date = EXCLUDED.date,
  "pageViews" = EXCLUDED."pageViews",
  likes = EXCLUDED.likes,
  "ai_questions" = EXCLUDED."ai_questions",
  "ai_summaries" = EXCLUDED."ai_summaries",
  "uniqueVisitors" = EXCLUDED."uniqueVisitors",
  reads = EXCLUDED.reads,
  comments = EXCLUDED.comments;

-- 8. Insert sample comments with proper conflict handling
-- English comments
INSERT INTO comments ("postId", "authorName", "authorEmail", content, status, "language", "createdAt") 
SELECT p.id, c."authorName", c."authorEmail", c.content, c.status, c."language", NOW()
FROM (
  SELECT 
    'buying-property-new-zealand-complete-guide' as slug,
    'John Smith' as "authorName",
    'johnsmith@example.com' as "authorEmail",
    'Great guide for buying property in NZ! Very helpful for first-time buyers.' as content,
    'approved' as status,
    'en' as "language"
  UNION ALL
  SELECT 
    'buying-property-new-zealand-complete-guide' as slug,
    'Sarah Johnson' as "authorName",
    'sarahj@example.com' as "authorEmail",
    'Thanks for the detailed information. The section on financing was particularly useful.' as content,
    'approved' as status,
    'en' as "language"
  UNION ALL
  SELECT 
    'selling-your-home-new-zealand-step-by-step' as slug,
    'Michael Brown' as "authorName",
    'michaelb@example.com' as "authorEmail",
    'Excellent step-by-step guide for selling property. The marketing tips are spot on!' as content,
    'approved' as status,
    'en' as "language"
  UNION ALL
  SELECT 
    'new-zealand-property-market-trends-2024' as slug,
    'Anonymous' as "authorName",
    'anonymous@example.com' as "authorEmail",
    'Interesting insights into the NZ property market. Looking forward to more updates!' as content,
    'approved' as status,
    'en' as "language"
  UNION ALL
  SELECT 
    'first-home-buyer-financing-guide-new-zealand' as slug,
    'Emma Wilson' as "authorName",
    'emmaw@example.com' as "authorEmail",
    'As a first home buyer, this guide answered all my questions about financing options.' as content,
    'approved' as status,
    'en' as "language"
) c
JOIN posts p ON p.slug = c.slug AND p."authorId" = 'nzmarie' AND p."language" = 'en'
ON CONFLICT DO NOTHING;

-- Chinese comments
INSERT INTO comments ("postId", "authorName", "authorEmail", content, status, "language", "createdAt") 
SELECT p.id, c."authorName", c."authorEmail", c.content, c.status, c."language", NOW()
FROM (
  SELECT 
    'buying-property-new-zealand-complete-guide' as slug,
    '张三' as "authorName",
    'zhangsan@example.com' as "authorEmail",
    '很棒的购房指南！对首次购房者非常有帮助。' as content,
    'approved' as status,
    'zh' as "language"
  UNION ALL
  SELECT 
    'buying-property-new-zealand-complete-guide' as slug,
    '李四' as "authorName",
    'lisi@example.com' as "authorEmail",
    '感谢分享这么详细的购房信息，贷款部分特别有用。' as content,
    'approved' as status,
    'zh' as "language"
  UNION ALL
  SELECT 
    'selling-your-home-new-zealand-step-by-step' as slug,
    '王五' as "authorName",
    'wangwu@example.com' as "authorEmail",
    '出售房产的详细指南很棒，营销建议非常实用！' as content,
    'approved' as status,
    'zh' as "language"
  UNION ALL
  SELECT 
    'new-zealand-property-market-trends-2024' as slug,
    '匿名用户' as "authorName",
    'anonymous@example.com' as "authorEmail",
    '对新西兰房地产市场的见解很有趣，期待更多更新！' as content,
    'approved' as status,
    'zh' as "language"
  UNION ALL
  SELECT 
    'first-home-buyer-financing-guide-new-zealand' as slug,
    '刘六' as "authorName",
    'liuliu@example.com' as "authorEmail",
    '作为首次购房者，这份指南回答了我所有关于贷款选择的问题。' as content,
    'approved' as status,
    'zh' as "language"
) c
JOIN posts p ON p.slug = c.slug AND p."authorId" = 'nzmarie' AND p."language" = 'zh'
ON CONFLICT DO NOTHING;

-- 9. Create unique constraints after cleaning up duplicates
-- Note: Create unique constraints after cleaning up duplicate data
DO $$ 
BEGIN
    -- Create new unique constraints that include language
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'post_stats_post_id_language_unique' 
                   AND table_name = 'post_stats') THEN
        ALTER TABLE post_stats ADD CONSTRAINT post_stats_post_id_language_unique UNIQUE("post_id", "language");
    END IF;
    
    -- Note: In Supabase database, daily_stats table uses post_id instead of userId
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'daily_stats_post_id_language_key' 
                   AND table_name = 'daily_stats') THEN
        ALTER TABLE daily_stats ADD CONSTRAINT daily_stats_post_id_language_key UNIQUE("post_id", "language");
    END IF;
END $$;

-- 10. Verify the updates
SELECT 
  "language",
  COUNT(*) as post_count,
  SUM(views) as total_views,
  SUM(likes) as total_likes,
  SUM("ai_questions") as total_ai_questions,
  SUM("ai_summaries") as total_ai_summaries
FROM post_stats 
GROUP BY "language" 
ORDER BY "language";

SELECT 
  "language",
  COUNT(*) as comment_count
FROM comments 
GROUP BY "language" 
ORDER BY "language";

SELECT id, "authorId", title, "language" FROM posts WHERE "authorId" = 'nzmarie' ORDER BY "language", "createdAt" DESC;