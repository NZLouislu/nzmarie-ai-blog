-- Reset and Update All NZMarie Posts - Minimal Metadata Only
-- This script removes all existing NZMarie posts and re-inserts minimal metadata
-- Article content will continue to be read from .md files
-- ID will be the same as slug for consistency

-- Step 0: Fix database constraints to ensure consistency
-- Remove old constraint if it exists
ALTER TABLE post_stats DROP CONSTRAINT IF EXISTS post_stats_post_id_key;
-- Ensure new constraint exists
ALTER TABLE post_stats ADD CONSTRAINT post_stats_post_id_language_key UNIQUE (post_id, language);

-- Step 1: Delete all existing NZMarie posts
DELETE FROM posts WHERE "authorId" = 'nzmarie';

-- Step 2: Delete related statistics (optional, uncomment if needed)
-- DELETE FROM post_stats WHERE "post_id" IN (SELECT id FROM posts WHERE "authorId" = 'nzmarie');
-- DELETE FROM comments WHERE "postId" IN (SELECT id FROM posts WHERE "authorId" = 'nzmarie');

-- Step 3: Insert all NZMarie posts with minimal metadata (English)
-- ID is now the same as slug for consistency
INSERT INTO posts (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
VALUES 
('buying-property-new-zealand-complete-guide', 'nzmarie', 'buying-property-new-zealand-complete-guide', 
'Your Complete Guide to Buying Property in New Zealand', 
'This is a placeholder content for the blog post about buying property in New Zealand.', 
'en', 'published', NOW(), 'real-estate,property-buying,new-zealand,first-home-buyer,investment', NOW(), NOW()),

('selling-your-home-new-zealand-step-by-step', 'nzmarie', 'selling-your-home-new-zealand-step-by-step', 
'Selling Your Home in New Zealand: A Step-by-Step Guide for Homeowners', 
'This is a placeholder content for the blog post about selling your home in New Zealand.',
'en', 'published', NOW(), 'real-estate,property-selling,new-zealand,home-selling,real-estate-agent', NOW(), NOW()),

('navigating-legal-aspects-property-purchase-new-zealand', 'nzmarie', 'navigating-legal-aspects-property-purchase-new-zealand', 
'Navigating the Legal Aspects of Property Purchase in New Zealand', 
'This is a placeholder content for the blog post about navigating legal aspects of property purchase in New Zealand.',
'en', 'published', NOW(), 'real-estate,property-law,new-zealand,purchase,legal', NOW(), NOW()),

('new-zealand-property-market-trends-2024', 'nzmarie', 'new-zealand-property-market-trends-2024', 
'New Zealand Property Market Trends 2024: What Investors Need to Know', 
'This is a placeholder content for the blog post about New Zealand property market trends in 2024.',
'en', 'published', NOW(), 'real-estate,property-market,new-zealand,investment,trends', NOW(), NOW()),

('first-home-buyer-financing-guide-new-zealand', 'nzmarie', 'first-home-buyer-financing-guide-new-zealand', 
'First Home Buyer Financing Guide for New Zealand', 
'This is a placeholder content for the blog post about first home buyer financing guide for New Zealand.',
'en', 'published', NOW(), 'first-home-buyer,mortgage,financing,new-zealand,property', NOW(), NOW()),

('maximizing-property-investment-returns-new-zealand', 'nzmarie', 'maximizing-property-investment-returns-new-zealand', 
'Maximizing Property Investment Returns in New Zealand', 
'This is a placeholder content for the blog post about maximizing property investment returns in New Zealand.',
'en', 'published', NOW(), 'property-investment,returns,new-zealand,real-estate,investment-strategy', NOW(), NOW()),

('understanding-body-corporate-apartment-owners-new-zealand', 'nzmarie', 'understanding-body-corporate-apartment-owners-new-zealand', 
'Understanding Body Corporate for Apartment Owners in New Zealand', 
'This is a placeholder content for the blog post about understanding body corporate for apartment owners in New Zealand.',
'en', 'published', NOW(), 'body-corporate,apartment,owners,new-zealand,strata', NOW(), NOW()),

('new-zealand-property-investment-guide-australian-expats', 'nzmarie', 'new-zealand-property-investment-guide-australian-expats', 
'New Zealand Property Investment Guide for Australian Expats', 
'This is a placeholder content for the blog post about New Zealand property investment guide for Australian expats.',
'en', 'published', NOW(), 'property-investment,australian-expats,new-zealand,real-estate,expat', NOW(), NOW()),

('retirement-planning-new-zealand-property-owners', 'nzmarie', 'retirement-planning-new-zealand-property-owners', 
'Retirement Planning for New Zealand Property Owners', 
'This is a placeholder content for the blog post about retirement planning for New Zealand property owners.',
'en', 'published', NOW(), 'retirement,planning,property-owners,new-zealand,investment', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  "authorId" = EXCLUDED."authorId",
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  "publishedAt" = EXCLUDED."publishedAt",
  tags = EXCLUDED.tags,
  "updatedAt" = NOW();

-- Step 4: Insert all NZMarie posts with minimal metadata (Chinese)
-- ID is now the same as slug with language suffix for consistency
INSERT INTO posts (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
VALUES 
('buying-property-new-zealand-complete-guide-zh', 'nzmarie', 'buying-property-new-zealand-complete-guide', 
'Complete Guide to Buying Property in NZ', 
'This is a placeholder content for the blog post about buying property in New Zealand.',
'zh', 'published', NOW(), 'real-estate,property-buying,new-zealand,first-home-buyer,investment', NOW(), NOW()),

('selling-your-home-new-zealand-step-by-step-zh', 'nzmarie', 'selling-your-home-new-zealand-step-by-step', 
'Step-by-Step Guide to Selling Your Home in NZ', 
'This is a placeholder content for the blog post about selling your home in New Zealand.',
'zh', 'published', NOW(), 'real-estate,property-selling,new-zealand,home-selling,real-estate-agent', NOW(), NOW()),

('navigating-legal-aspects-property-purchase-new-zealand-zh', 'nzmarie', 'navigating-legal-aspects-property-purchase-new-zealand', 
'Navigating Legal Aspects of Property Purchase in NZ', 
'This is a placeholder content for the blog post about navigating legal aspects of property purchase in New Zealand.',
'zh', 'published', NOW(), 'real-estate,property-law,new-zealand,purchase,legal', NOW(), NOW()),

('new-zealand-property-market-trends-2024-zh', 'nzmarie', 'new-zealand-property-market-trends-2024', 
'NZ Property Market Trends 2024: What Investors Need to Know', 
'This is a placeholder content for the blog post about New Zealand property market trends in 2024.',
'zh', 'published', NOW(), 'real-estate,property-market,new-zealand,investment,trends', NOW(), NOW()),

('first-home-buyer-financing-guide-new-zealand-zh', 'nzmarie', 'first-home-buyer-financing-guide-new-zealand', 
'First Home Buyer Financing Guide for NZ', 
'This is a placeholder content for the blog post about first home buyer financing guide for New Zealand.',
'zh', 'published', NOW(), 'first-home-buyer,mortgage,financing,new-zealand,property', NOW(), NOW()),

('maximizing-property-investment-returns-new-zealand-zh', 'nzmarie', 'maximizing-property-investment-returns-new-zealand', 
'Maximizing Property Investment Returns in NZ', 
'This is a placeholder content for the blog post about maximizing property investment returns in New Zealand.',
'zh', 'published', NOW(), 'property-investment,returns,new-zealand,real-estate,investment-strategy', NOW(), NOW()),

('understanding-body-corporate-apartment-owners-new-zealand-zh', 'nzmarie', 'understanding-body-corporate-apartment-owners-new-zealand', 
'Understanding Body Corporate for Apartment Owners in NZ', 
'This is a placeholder content for the blog post about understanding body corporate for apartment owners in New Zealand.',
'zh', 'published', NOW(), 'body-corporate,apartment,owners,new-zealand,strata', NOW(), NOW()),

('new-zealand-property-investment-guide-australian-expats-zh', 'nzmarie', 'new-zealand-property-investment-guide-australian-expats', 
'NZ Property Investment Guide for Australian Expats', 
'This is a placeholder content for the blog post about New Zealand property investment guide for Australian expats.',
'zh', 'published', NOW(), 'property-investment,australian-expats,new-zealand,real-estate,expat', NOW(), NOW()),

('retirement-planning-new-zealand-property-owners-zh', 'nzmarie', 'retirement-planning-new-zealand-property-owners', 
'Retirement Planning for NZ Property Owners', 
'This is a placeholder content for the blog post about retirement planning for New Zealand property owners.',
'zh', 'published', NOW(), 'retirement,planning,property-owners,new-zealand,investment', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  "authorId" = EXCLUDED."authorId",
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  "publishedAt" = EXCLUDED."publishedAt",
  tags = EXCLUDED.tags,
  "updatedAt" = NOW();

-- Step 5: Insert or update post statistics for all NZMarie posts
-- Statistics IDs now match the post IDs
INSERT INTO post_stats ("post_id", title, views, likes, "ai_questions", "ai_summaries", language, comments)
VALUES 
('buying-property-new-zealand-complete-guide', 'Your Complete Guide to Buying Property in New Zealand', 150, 12, 5, 3, 'en', 2),
('selling-your-home-new-zealand-step-by-step', 'Selling Your Home in New Zealand: A Step-by-Step Guide for Homeowners', 230, 18, 8, 4, 'en', 3),
('navigating-legal-aspects-property-purchase-new-zealand', 'Navigating the Legal Aspects of Property Purchase in New Zealand', 95, 8, 3, 2, 'en', 1),
('new-zealand-property-market-trends-2024', 'New Zealand Property Market Trends 2024: What Investors Need to Know', 180, 15, 6, 3, 'en', 2),
('first-home-buyer-financing-guide-new-zealand', 'First Home Buyer Financing Guide for New Zealand', 120, 10, 4, 2, 'en', 1),
('maximizing-property-investment-returns-new-zealand', 'Maximizing Property Investment Returns in New Zealand', 160, 14, 5, 3, 'en', 2),
('understanding-body-corporate-apartment-owners-new-zealand', 'Understanding Body Corporate for Apartment Owners in New Zealand', 85, 7, 2, 1, 'en', 1),
('new-zealand-property-investment-guide-australian-expats', 'New Zealand Property Investment Guide for Australian Expats', 110, 9, 4, 2, 'en', 1),
('retirement-planning-new-zealand-property-owners', 'Retirement Planning for New Zealand Property Owners', 90, 8, 3, 1, 'en', 1),
('buying-property-new-zealand-complete-guide-zh', 'Complete Guide to Buying Property in NZ', 120, 10, 4, 2, 'zh', 1),
('selling-your-home-new-zealand-step-by-step-zh', 'Step-by-Step Guide to Selling Your Home in NZ', 200, 16, 7, 3, 'zh', 2),
('navigating-legal-aspects-property-purchase-new-zealand-zh', 'Navigating Legal Aspects of Property Purchase in NZ', 80, 7, 3, 1, 'zh', 1),
('new-zealand-property-market-trends-2024-zh', 'NZ Property Market Trends 2024: What Investors Need to Know', 150, 12, 5, 2, 'zh', 1),
('first-home-buyer-financing-guide-new-zealand-zh', 'First Home Buyer Financing Guide for NZ', 100, 9, 4, 2, 'zh', 1),
('maximizing-property-investment-returns-new-zealand-zh', 'Maximizing Property Investment Returns in NZ', 140, 11, 5, 2, 'zh', 1),
('understanding-body-corporate-apartment-owners-new-zealand-zh', 'Understanding Body Corporate for Apartment Owners in NZ', 75, 6, 2, 1, 'zh', 1),
('new-zealand-property-investment-guide-australian-expats-zh', 'NZ Property Investment Guide for Australian Expats', 95, 8, 3, 1, 'zh', 1),
('retirement-planning-new-zealand-property-owners-zh', 'Retirement Planning for NZ Property Owners', 85, 7, 3, 1, 'zh', 1)
ON CONFLICT ("post_id", language) DO UPDATE SET
  title = EXCLUDED.title,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  "ai_questions" = EXCLUDED."ai_questions",
  "ai_summaries" = EXCLUDED."ai_summaries",
  language = EXCLUDED.language,
  comments = EXCLUDED.comments;

-- All NZMarie posts have been reset and updated with minimal metadata, IDs now match slugs