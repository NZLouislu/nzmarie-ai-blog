# 更新文章存储结构说明

## 概述

根据您的要求，我们需要修改文章存储方式，使 posts 表只存储文章名称和标题，而不是完整的文章内容。文章内容将继续存储在 Markdown 文件中。

## 修改内容

### 1. 数据库结构变更

我们已经创建了以下 SQL 脚本来更新数据库结构：

1. `update_posts_structure.sql` - 更新 posts 表结构，移除 content 列
2. `update_nzmarie_posts_minimal.sql` - 为 NZMarie 添加文章记录（仅包含名称和标题）
3. `nzmarie_supabase_data_minimal.sql` - NZMarie 的完整初始化脚本（仅包含名称和标题）

### 2. 代码变更

我们已经更新了以下文件：

- `lib/posts.ts` - 添加了 getPostMetadataBySlug 函数，用于从数据库获取文章元数据

## 执行步骤

### 步骤 1：更新数据库结构

在 Supabase SQL 编辑器中执行以下脚本：

```sql
-- 执行 update_posts_structure.sql 的内容
```

### 步骤 2：更新 NZMarie 的文章数据

在 Supabase SQL 编辑器中执行以下脚本：

```sql
-- 执行 update_nzmarie_posts_minimal.sql 的内容
```

### 步骤 3：验证变更

验证数据库中的 posts 表现在只包含以下列：

- id
- authorId
- slug
- title
- language
- status
- publishedAt
- coverImage
- tags
- createdAt
- updatedAt

不再包含 content 列。

## 后续步骤

1. 确保所有 API 路由都适应新的数据库结构
2. 验证博客页面仍然可以正确显示文章内容（从 Markdown 文件读取）
3. 测试文章统计功能是否正常工作

## 注意事项

1. 这个变更不会影响现有的 Markdown 文件结构
2. 文章内容仍然从 Markdown 文件中读取
3. 数据库只存储文章的元数据，用于链接和统计
