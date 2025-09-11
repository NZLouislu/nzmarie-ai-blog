-- Update database to support Chinese blog posts
-- Execute this script in Supabase SQL editor manually

-- 1. Add language column to tables if not exists
ALTER TABLE post_stats ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

-- 2. Update existing data to be marked as English
UPDATE post_stats SET language = 'en' WHERE language IS NULL OR language = '';
UPDATE daily_stats SET language = 'en' WHERE language IS NULL OR language = '';
UPDATE comments SET language = 'en' WHERE language IS NULL OR language = '';

-- 3. Handle constraints safely
-- First, check if foreign key constraint exists and drop it if needed
DO $$ 
BEGIN
    -- Drop foreign key constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_comment_poststat' 
               AND table_name = 'comments') THEN
        ALTER TABLE comments DROP CONSTRAINT fk_comment_poststat;
    END IF;
    
    -- Drop the old unique constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'post_stats_post_id_key' 
               AND table_name = 'post_stats') THEN
        ALTER TABLE post_stats DROP CONSTRAINT post_stats_post_id_key;
    END IF;
END $$;

-- Create new unique constraint that includes language
ALTER TABLE post_stats ADD CONSTRAINT post_stats_post_id_language_unique UNIQUE(post_id, language);

-- Handle daily_stats constraints
DO $$ 
BEGIN
    -- Drop the old unique constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'daily_stats_post_id_date_key' 
               AND table_name = 'daily_stats') THEN
        ALTER TABLE daily_stats DROP CONSTRAINT daily_stats_post_id_date_key;
    END IF;
END $$;

-- Create new unique constraint for daily_stats
ALTER TABLE daily_stats ADD CONSTRAINT daily_stats_post_id_date_language_unique UNIQUE(post_id, date, language);

-- 4. Insert Chinese blog post statistics
INSERT INTO post_stats (post_id, title, views, likes, ai_questions, ai_summaries, language) VALUES
('2024-03-10-java-and-spring-in-depth-understanding', 'Java和Spring：深度分析与全面理解', 120, 20, 6, 10, 'zh'),
('2024-03-02-the-trio-of-frontend-development', '前端开发三驾马车：JavaScript、HTML和CSS', 95, 15, 5, 8, 'zh'),
('2024-02-24-backend-tech-the-foundation-of-software', '后端技术：软件构建的基石', 80, 12, 3, 6, 'zh'),
('2024-02-17-react-18-typescript-powerful-combination-frontend', 'React 18 + TypeScript：前端应用的强强联合', 100, 18, 6, 9, 'zh'),
('2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security', 'React：前端开发的强力工具，掌握它就业无忧！', 75, 10, 2, 4, 'zh'),
('2024-02-04-front-end-development-in-2024-trends-and-future-directions', '2024年前端开发：趋势与未来方向', 130, 25, 8, 12, 'zh'),
('2024-01-28-microservices-architecture-empowering-online-banking-services', '微服务架构助力网银服务：安全、高效、可扩展', 65, 8, 2, 3, 'zh'),
('2024-01-20-new_zealand_paradise_for_children', '新西兰：孩子们的天堂', 180, 30, 12, 18, 'zh'),
('2024-01-10-will-ai-replace-human-developers', 'AI会完全取代人类开发者吗？', 160, 25, 10, 14, 'zh')
ON CONFLICT (post_id, language) DO UPDATE SET
  title = EXCLUDED.title,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  ai_questions = EXCLUDED.ai_questions,
  ai_summaries = EXCLUDED.ai_summaries;

-- 5. Insert Chinese blog daily statistics
INSERT INTO daily_stats (post_id, date, views, likes, ai_questions, ai_summaries, language) VALUES
('2024-03-10-java-and-spring-in-depth-understanding', CURRENT_DATE, 12, 2, 1, 2, 'zh'),
('2024-03-02-the-trio-of-frontend-development', CURRENT_DATE, 10, 1, 0, 1, 'zh'),
('2024-02-24-backend-tech-the-foundation-of-software', CURRENT_DATE, 8, 1, 0, 1, 'zh'),
('2024-02-17-react-18-typescript-powerful-combination-frontend', CURRENT_DATE, 9, 2, 1, 1, 'zh'),
('2024-01-20-new_zealand_paradise_for_children', CURRENT_DATE, 18, 3, 2, 3, 'zh'),
('2024-01-10-will-ai-replace-human-developers', CURRENT_DATE, 16, 2, 1, 2, 'zh')
ON CONFLICT (post_id, date, language) DO UPDATE SET
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  ai_questions = EXCLUDED.ai_questions,
  ai_summaries = EXCLUDED.ai_summaries;

-- 6. Insert sample Chinese comments
INSERT INTO comments (post_id, name, email, comment, is_anonymous, language) VALUES
('2024-03-10-java-and-spring-in-depth-understanding', '张三', 'zhangsan@example.com', '很棒的文章！Java和Spring的讲解非常全面。', false, 'zh'),
('2024-03-10-java-and-spring-in-depth-understanding', '李四', 'lisi@example.com', '感谢分享这么详细的指南，对我帮助很大！', false, 'zh'),
('2024-03-02-the-trio-of-frontend-development', '王五', 'wangwu@example.com', '前端技术的全面介绍，很有参考价值！', false, 'zh'),
('2024-01-20-new_zealand_paradise_for_children', '刘六', 'liuliu@example.com', '关于新西兰的美丽文章，照片很棒！', false, 'zh'),
('2024-01-10-will-ai-replace-human-developers', NULL, NULL, '对AI和开发的有趣观点，期待更多文章！', true, 'zh');

-- 7. Verify the updates
SELECT 
  language,
  COUNT(*) as post_count,
  SUM(views) as total_views,
  SUM(likes) as total_likes,
  SUM(ai_questions) as total_ai_questions,
  SUM(ai_summaries) as total_ai_summaries
FROM post_stats 
GROUP BY language 
ORDER BY language;

SELECT 
  language,
  COUNT(*) as comment_count
FROM comments 
GROUP BY language 
ORDER BY language;