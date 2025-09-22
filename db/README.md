# 数据库SQL脚本

这个目录包含了两个核心的SQL脚本，用于管理NZMarie博客的数据库：

## 1. reset_and_update_all_nzmarie_posts.sql

**用途**: 重置并更新所有NZMarie的文章数据
- 删除所有现有的NZMarie文章
- 重新插入最小元数据
- 更新文章统计信息（包含comments字段）

**使用场景**: 
- 当需要完全重新初始化NZMarie的文章数据时
- 当文章内容需要从Markdown文件重新加载时

## 2. init_nzmarie_final.sql

**用途**: 初始化NZMarie博客的完整数据库结构
- 清理现有数据
- 插入用户信息
- 插入文章数据
- 插入文章统计信息（包含comments字段）
- 插入示例评论
- 插入每日统计数据（包含comments字段）

**使用场景**:
- 首次设置NZMarie博客数据库
- 完整重新初始化所有博客数据

## 重要提醒

这两个SQL脚本是维护NZMarie博客数据库的唯二核心文件。在进行任何数据库操作时，请优先使用这两个文件，以确保数据结构的一致性和完整性。