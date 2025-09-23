# 数据库测试和检查工具

这个目录包含了用于测试和检查数据库结构及数据的各种工具脚本。

## 文件说明

### 检查表结构的工具

- `check_schema.js` - 检查 SQLite 数据库中表的结构
- `check_table_structure.js` - 检查特定表的结构
- `check_posts_structure.js` - 检查 posts 表的结构和数据
- `check_supabase_constraints.js` - 检查 Supabase 数据库中的约束
- `check_constraints.js` - 检查数据库约束
- `check_actual_constraints.js` - 检查实际的数据库约束

### 测试数据库连接和功能的工具

- `test-supabase.js` - 测试 Supabase 数据库连接和查询
- `test-toggles-fix.js` - 测试功能开关的修复
- `test_db.js` - 测试数据库连接和基本查询
- `test-posts.js` - 测试 posts 相关功能

### 其他工具

- `db-query.js` - 数据库查询工具
- `query-sqlite.js` - SQLite 数据库查询
- `temp-query.js` - 临时查询工具

## 使用方法

这些工具可以直接通过 Node.js 运行：

```bash
node lib/db/文件名.js
```

## 注意事项

1. 运行这些工具前确保环境变量已正确设置
2. 部分工具需要 Supabase 配置
3. 这些工具主要用于开发和调试目的
