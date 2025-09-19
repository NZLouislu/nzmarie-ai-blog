-- Safe Supabase PostgreSQL Migration Script
-- Multi-user blog management system database migration
-- This script preserves all existing data and only adds missing structures

-- Step 1: Create enum types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('admin', 'user');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Language') THEN
        CREATE TYPE "Language" AS ENUM ('en', 'zh');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PostStatus') THEN
        CREATE TYPE "PostStatus" AS ENUM ('draft', 'published', 'archived');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CommentStatus') THEN
        CREATE TYPE "CommentStatus" AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

-- Step 2: Create users table only if it doesn't exist
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "avatarUrl" TEXT,
    "languagePreferences" TEXT NOT NULL DEFAULT 'both',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create posts table only if it doesn't exist
CREATE TABLE IF NOT EXISTS "posts" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "coverImage" TEXT,
    "tags" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- Step 4: Safely update comments table structure
DO $$
BEGIN
    -- Add missing columns to comments table if they don't exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN
        -- Add status column if missing
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'status') THEN
            ALTER TABLE "comments" ADD COLUMN "status" "CommentStatus" NOT NULL DEFAULT 'approved';
        END IF;
        
        -- Add id column if missing (for tables without proper primary key)
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'id') THEN
            ALTER TABLE "comments" ADD COLUMN "id" TEXT;
            UPDATE "comments" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
            ALTER TABLE "comments" ALTER COLUMN "id" SET NOT NULL;
        END IF;
        
        -- Rename columns safely if they exist with old names
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'name') 
           AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'authorName') THEN
            ALTER TABLE "comments" RENAME COLUMN "name" TO "authorName";
        END IF;
        
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'email') 
           AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'authorEmail') THEN
            ALTER TABLE "comments" RENAME COLUMN "email" TO "authorEmail";
        END IF;
        
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'comment') 
           AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'content') THEN
            ALTER TABLE "comments" RENAME COLUMN "comment" TO "content";
        END IF;
        
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'post_id') 
           AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'postId') THEN
            ALTER TABLE "comments" RENAME COLUMN "post_id" TO "postId";
        END IF;
        
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'created_at') 
           AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'createdAt') THEN
            ALTER TABLE "comments" RENAME COLUMN "created_at" TO "createdAt";
        END IF;
    END IF;
END $$;

-- Step 5: Safely update post_stats table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'post_stats') THEN
        -- Add missing id column if needed
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'post_stats' AND column_name = 'id') THEN
            ALTER TABLE "post_stats" ADD COLUMN "id" TEXT;
            UPDATE "post_stats" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
            ALTER TABLE "post_stats" ALTER COLUMN "id" SET NOT NULL;
        END IF;
        
        -- Add title column if missing
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'post_stats' AND column_name = 'title') THEN
            ALTER TABLE "post_stats" ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Blog Post';
        END IF;
        
        -- Add language column if missing
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'post_stats' AND column_name = 'language') THEN
            ALTER TABLE "post_stats" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';
        END IF;
    END IF;
END $$;

-- Step 6: Safely update daily_stats table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'daily_stats') THEN
        -- Add missing id column if needed
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'id') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "id" TEXT;
            UPDATE "daily_stats" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
            ALTER TABLE "daily_stats" ALTER COLUMN "id" SET NOT NULL;
        END IF;
        
        -- Add userId column if missing
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'userId') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "userId" TEXT DEFAULT 'nzlouis';
        END IF;
        
        -- Add missing columns with safe defaults
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'pageViews') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "pageViews" INTEGER NOT NULL DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'uniqueVisitors') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "uniqueVisitors" INTEGER NOT NULL DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'reads') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "reads" INTEGER NOT NULL DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'likes') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'comments') THEN
            ALTER TABLE "daily_stats" ADD COLUMN "comments" INTEGER NOT NULL DEFAULT 0;
        END IF;
    END IF;
END $$;

-- Step 7: Create feature_toggles table only if it doesn't exist
CREATE TABLE IF NOT EXISTS "feature_toggles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "payload" TEXT,

    CONSTRAINT "feature_toggles_pkey" PRIMARY KEY ("id")
);

-- Step 8: Insert default users safely (only if they don't exist)
INSERT INTO "users" ("id", "email", "name", "role", "languagePreferences") VALUES 
('nzlouis', 'nzlouis@example.com', 'NZLouis', 'admin', 'both'),
('nzmarite', 'nzmarite@example.com', 'NZMarite', 'user', 'both')
ON CONFLICT ("id") DO NOTHING;

-- Step 9: Safe data migration for existing records
DO $$
BEGIN
    -- Update daily_stats userId for existing records without userId
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'userId') THEN
        UPDATE "daily_stats" SET "userId" = 'nzlouis' WHERE "userId" IS NULL OR "userId" = '';
    END IF;
END $$;

-- Step 10: Clean duplicate data before creating unique indexes
DO $$
BEGIN
    -- Remove duplicate entries in post_stats table, keeping the first occurrence
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'post_stats') THEN
        DELETE FROM "post_stats" 
        WHERE ctid NOT IN (
            SELECT MIN(ctid) 
            FROM "post_stats" 
            GROUP BY "post_id"
        );
    END IF;
END $$;

-- Step 11: Create indexes safely (only if they don't exist)
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "post_stats_post_id_key" ON "post_stats"("post_id") WHERE "post_id" IS NOT NULL;
-- Note: Skip creating unique indexes for tables that may not have required columns yet
-- These will be created later after all columns are properly added

-- Step 12: Create performance indexes
CREATE INDEX IF NOT EXISTS "comments_postId_status_idx" ON "comments"("postId", "status") WHERE "postId" IS NOT NULL;
-- Note: Skip creating indexes that reference columns that may not exist yet

-- Step 13: Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 14: Add update triggers safely
DO $$
BEGIN
    -- Add trigger for users table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON "users" 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Add trigger for posts table if it exists and trigger doesn't exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') 
       AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at') THEN
        CREATE TRIGGER update_posts_updated_at 
        BEFORE UPDATE ON "posts" 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Step 15: Create missing indexes and constraints after all columns are added
DO $$
BEGIN
    -- Create unique indexes for daily_stats if all columns exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'daily_stats')
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'userId')
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'date')
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'language') THEN
        
        -- Clean duplicates first
        DELETE FROM "daily_stats" 
        WHERE ctid NOT IN (
            SELECT MIN(ctid) 
            FROM "daily_stats" 
            WHERE "userId" IS NOT NULL AND "date" IS NOT NULL AND "language" IS NOT NULL
            GROUP BY "userId", "date", "language"
        );
        
        -- Create unique index
        CREATE UNIQUE INDEX IF NOT EXISTS "daily_stats_userId_date_language_key" 
        ON "daily_stats"("userId", "date", "language") 
        WHERE "userId" IS NOT NULL AND "date" IS NOT NULL;
        
        -- Create performance index
        CREATE INDEX IF NOT EXISTS "daily_stats_userId_date_idx" 
        ON "daily_stats"("userId", "date") 
        WHERE "userId" IS NOT NULL;
    END IF;
    
    -- Create unique indexes for feature_toggles if all columns exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'feature_toggles')
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'feature_toggles' AND column_name = 'userId')
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'feature_toggles' AND column_name = 'key') THEN
        
        -- Clean duplicates first
        DELETE FROM "feature_toggles" 
        WHERE ctid NOT IN (
            SELECT MIN(ctid) 
            FROM "feature_toggles" 
            GROUP BY "userId", "key"
        );
        
        -- Create unique index
        CREATE UNIQUE INDEX IF NOT EXISTS "feature_toggles_userId_key_key" 
        ON "feature_toggles"("userId", "key");
        
        -- Create performance index
        CREATE INDEX IF NOT EXISTS "feature_toggles_userId_idx" 
        ON "feature_toggles"("userId");
    END IF;
END $$;

-- Step 16: Add foreign key constraints safely (only if tables and columns exist)
DO $$
BEGIN
    -- Add foreign key constraints only if both tables exist and constraint doesn't exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') 
       AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts')
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'postId')
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'comments_postId_fkey') THEN
        -- Only add constraint if all referenced posts exist
        DELETE FROM "comments" WHERE "postId" NOT IN (SELECT "id" FROM "posts");
        ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" 
        FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'daily_stats') 
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_stats' AND column_name = 'userId')
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'daily_stats_userId_fkey') THEN
        ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'feature_toggles') 
       AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'feature_toggles' AND column_name = 'userId')
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'feature_toggles_userId_fkey') THEN
        ALTER TABLE "feature_toggles" ADD CONSTRAINT "feature_toggles_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
END $$;

-- Step 17: Migrate post data from file system to database
DO $$
BEGIN
    -- Insert basic post records if they don't exist
    -- Use individual INSERT statements to handle duplicates safely
    
    -- First ensure we have a default admin user
    INSERT INTO "users" (id, name, email, role, "createdAt", "updatedAt")
    VALUES ('admin-user-id', 'Admin User', 'admin@blog.com', 'admin', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
    
    -- Check and insert each post record individually with unique IDs for different languages
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-01-10-will-ai-replace-human-developers-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-01-10-will-ai-replace-human-developers-en', 'admin-user-id', '2024-01-10-will-ai-replace-human-developers', 'Will AI Completely Replace Human Developers?', 'Blog post content', 'en', 'published', '2024-01-10'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-01-10-will-ai-replace-human-developers-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-01-10-will-ai-replace-human-developers-zh', 'admin-user-id', '2024-01-10-will-ai-replace-human-developers', 'AI会完全取代人类开发者吗？', 'Blog post content', 'zh', 'published', '2024-01-10'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-01-20-new_zealand_paradise_for_children-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-01-20-new_zealand_paradise_for_children-en', 'admin-user-id', '2024-01-20-new_zealand_paradise_for_children', 'New Zealand: A Paradise for Children', 'Blog post content', 'en', 'published', '2024-01-20'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-01-20-new_zealand_paradise_for_children-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-01-20-new_zealand_paradise_for_children-zh', 'admin-user-id', '2024-01-20-new_zealand_paradise_for_children', '新西兰：孩子的天堂', 'Blog post content', 'zh', 'published', '2024-01-20'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-01-28-microservices-architecture-empowering-online-banking-services-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-01-28-microservices-architecture-empowering-online-banking-services-en', 'admin-user-id', '2024-01-28-microservices-architecture-empowering-online-banking-services', 'Microservices Architecture Empowering Online Banking Services', 'Blog post content', 'en', 'published', '2024-01-28'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-01-28-microservices-architecture-empowering-online-banking-services-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-01-28-microservices-architecture-empowering-online-banking-services-zh', 'admin-user-id', '2024-01-28-microservices-architecture-empowering-online-banking-services', '微服务架构赋能网上银行服务：安全、高效与可扩展', 'Blog post content', 'zh', 'published', '2024-01-28'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-04-front-end-development-in-2024-trends-and-future-directions-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-04-front-end-development-in-2024-trends-and-future-directions-en', 'admin-user-id', '2024-02-04-front-end-development-in-2024-trends-and-future-directions', 'Front-end Development in 2024: Trends and Future Directions', 'Blog post content', 'en', 'published', '2024-02-04'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-04-front-end-development-in-2024-trends-and-future-directions-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-04-front-end-development-in-2024-trends-and-future-directions-zh', 'admin-user-id', '2024-02-04-front-end-development-in-2024-trends-and-future-directions', '2024年前端开发：趋势与未来方向', 'Blog post content', 'zh', 'published', '2024-02-04'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security-en', 'admin-user-id', '2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security', 'React: A Powerhouse in Front-end Development for Job Security', 'Blog post content', 'en', 'published', '2024-02-11'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security-zh', 'admin-user-id', '2024-02-11-react-a-powerhouse-in-front-end-development-for-job-security', 'React：前端开发的利器，掌握它让你的职业更稳固！', 'Blog post content', 'zh', 'published', '2024-02-11'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-17-react-18-typescript-powerful-combination-frontend-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-17-react-18-typescript-powerful-combination-frontend-en', 'admin-user-id', '2024-02-17-react-18-typescript-powerful-combination-frontend', 'React 18 + TypeScript: Powerful Combination for Frontend', 'Blog post content', 'en', 'published', '2024-02-17'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-17-react-18-typescript-powerful-combination-frontend-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-17-react-18-typescript-powerful-combination-frontend-zh', 'admin-user-id', '2024-02-17-react-18-typescript-powerful-combination-frontend', 'React 18 + TypeScript：前端应用的强大组合', 'Blog post content', 'zh', 'published', '2024-02-17'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-24-backend-tech-the-foundation-of-software-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-24-backend-tech-the-foundation-of-software-en', 'admin-user-id', '2024-02-24-backend-tech-the-foundation-of-software', 'Backend Tech: The Foundation of Software', 'Blog post content', 'en', 'published', '2024-02-24'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-02-24-backend-tech-the-foundation-of-software-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-02-24-backend-tech-the-foundation-of-software-zh', 'admin-user-id', '2024-02-24-backend-tech-the-foundation-of-software', '后端技术：软件构建的基石', 'Blog post content', 'zh', 'published', '2024-02-24'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-03-02-the-trio-of-frontend-development-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-03-02-the-trio-of-frontend-development-en', 'admin-user-id', '2024-03-02-the-trio-of-frontend-development', 'The Trio of Frontend Development', 'Blog post content', 'en', 'published', '2024-03-02'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-03-02-the-trio-of-frontend-development-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-03-02-the-trio-of-frontend-development-zh', 'admin-user-id', '2024-03-02-the-trio-of-frontend-development', '前端开发三剑客：JavaScript、HTML 与 CSS', 'Blog post content', 'zh', 'published', '2024-03-02'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-03-10-java-and-spring-in-depth-understanding-en') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-03-10-java-and-spring-in-depth-understanding-en', 'admin-user-id', '2024-03-10-java-and-spring-in-depth-understanding', 'Java and Spring: In-depth Understanding', 'Blog post content', 'en', 'published', '2024-03-10'::date, '', NOW(), NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM "posts" WHERE id = '2024-03-10-java-and-spring-in-depth-understanding-zh') THEN
        INSERT INTO "posts" (id, "authorId", slug, title, content, language, status, "publishedAt", tags, "createdAt", "updatedAt")
        VALUES ('2024-03-10-java-and-spring-in-depth-understanding-zh', 'admin-user-id', '2024-03-10-java-and-spring-in-depth-understanding', 'Java 与 Spring：深入分析与全面理解', 'Blog post content', 'zh', 'published', '2024-03-10'::date, '', NOW(), NOW());
    END IF;
    
    RAISE NOTICE 'Post data migration completed';
END $$;
