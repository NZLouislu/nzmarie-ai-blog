-- 备份现有表以防万一
CREATE TABLE IF NOT EXISTS post_stats_backup AS SELECT * FROM post_stats;
CREATE TABLE IF NOT EXISTS daily_stats_backup AS SELECT * FROM daily_stats;

-- 添加 language 列到 post_stats 表，默认 'en' 不影响现有数据
ALTER TABLE post_stats ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

-- 添加 language 列到 daily_stats 表，默认 'en'
ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

-- 更新现有 post_stats 记录的 language 为 'en' (假设现有为英文)
UPDATE post_stats SET language = 'en' WHERE language IS NULL OR language = '';

-- 更新现有 daily_stats 记录的 language 为 'en'
UPDATE daily_stats SET language = 'en' WHERE language IS NULL OR language = '';

-- 验证变更 (可选)
SELECT COUNT(*) FROM post_stats WHERE language = 'en';
SELECT COUNT(*) FROM daily_stats WHERE language = 'en';