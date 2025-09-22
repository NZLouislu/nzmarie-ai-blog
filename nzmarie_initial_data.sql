-- NZMarie Initial Blog Data SQL
-- This script creates initial blog posts and related data for nzmarie user

-- First, ensure nzmarie user exists in the database
INSERT OR IGNORE INTO users (id, email, name, role, languagePreferences, createdAt, updatedAt)
VALUES ('nzmarie', 'nzmarie@example.com', 'NZ Marie', 'user', 'both', datetime('now'), datetime('now'));

-- Insert initial blog posts for nzmarie (English)
INSERT OR IGNORE INTO posts (id, authorId, slug, title, content, language, status, publishedAt, coverImage, tags, createdAt, updatedAt)
VALUES 
('marie-post-1-en', 'nzmarie', 'marie-introduction-to-web-development', 
'Introduction to Modern Web Development', 
'# Introduction to Modern Web Development

Welcome to my blog! I''m Marie, and I''m passionate about web development and technology.

## What You''ll Find Here

In this blog, I''ll be sharing my experiences and insights about:

- Frontend development with React and Vue.js
- Backend development with Node.js and Python
- Database design and optimization
- DevOps and deployment strategies
- Personal projects and learning journey

## My Background

I''ve been working in web development for several years, focusing on creating user-friendly and efficient web applications. I believe in continuous learning and sharing knowledge with the community.

## Let''s Connect

I''m excited to share my journey with you and learn from your experiences as well. Feel free to leave comments and engage in discussions!

Happy coding! 🚀', 
'en', 'published', datetime('now'), NULL, 'web-development,introduction,programming', datetime('now'), datetime('now')),

('marie-post-2-en', 'nzmarie', 'marie-react-hooks-deep-dive', 
'React Hooks: A Deep Dive', 
'# React Hooks: A Deep Dive

React Hooks have revolutionized how we write React components. Let''s explore the most commonly used hooks and their practical applications.

## useState Hook

The `useState` hook is the foundation of state management in functional components:

```javascript
const [count, setCount] = useState(0);
```

## useEffect Hook

For side effects and lifecycle management:

```javascript
useEffect(() => {
  // Effect logic here
  return () => {
    // Cleanup logic
  };
}, [dependencies]);
```

## Custom Hooks

Creating reusable logic with custom hooks:

```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
}
```

## Best Practices

1. Always include dependencies in useEffect
2. Use custom hooks for reusable logic
3. Keep components simple and focused
4. Use useCallback and useMemo for optimization

Happy coding with React Hooks! 🎣', 
'en', 'published', datetime('now'), NULL, 'react,hooks,javascript,frontend', datetime('now'), datetime('now')),

('marie-post-3-en', 'nzmarie', 'marie-css-grid-vs-flexbox', 
'CSS Grid vs Flexbox: When to Use Which', 
'# CSS Grid vs Flexbox: When to Use Which

Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes. Let''s understand when to use each.

## Flexbox: One-Dimensional Layouts

Flexbox is perfect for:
- Navigation bars
- Card layouts
- Centering content
- Distributing space along a single axis

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## CSS Grid: Two-Dimensional Layouts

CSS Grid excels at:
- Complex page layouts
- Magazine-style designs
- Dashboard layouts
- Any layout requiring precise control over rows and columns

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
```

## Combining Both

Often, the best approach is using both:
- Grid for the overall page layout
- Flexbox for component-level layouts

## Practical Example

```css
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

.navigation {
  display: flex;
  justify-content: space-between;
}
```

Choose the right tool for the job! 🎨', 
'en', 'published', datetime('now'), NULL, 'css,grid,flexbox,layout,frontend', datetime('now'), datetime('now'));

-- Insert initial blog posts for nzmarie (Chinese)
INSERT OR IGNORE INTO posts (id, authorId, slug, title, content, language, status, publishedAt, coverImage, tags, createdAt, updatedAt)
VALUES 
('marie-post-1-zh', 'nzmarie', 'marie-web-development-introduction-zh', 
'现代Web开发入门', 
'# 现代Web开发入门

欢迎来到我的博客！我是Marie，对Web开发和技术充满热情。

## 你将在这里找到什么

在这个博客中，我将分享我在以下方面的经验和见解：

- 使用React和Vue.js的前端开发
- 使用Node.js和Python的后端开发
- 数据库设计和优化
- DevOps和部署策略
- 个人项目和学习历程

## 我的背景

我在Web开发领域工作了几年，专注于创建用户友好且高效的Web应用程序。我相信持续学习并与社区分享知识。

## 让我们连接

我很兴奋与你分享我的旅程，也期待从你的经验中学习。欢迎留言和参与讨论！

快乐编程！🚀', 
'zh', 'published', datetime('now'), NULL, 'web开发,介绍,编程', datetime('now'), datetime('now')),

('marie-post-2-zh', 'nzmarie', 'marie-vue-composition-api-zh', 
'Vue 3 Composition API 深入解析', 
'# Vue 3 Composition API 深入解析

Vue 3的Composition API为我们提供了更灵活的组件逻辑组织方式。让我们深入了解其核心概念。

## 响应式数据

使用`ref`和`reactive`创建响应式数据：

```javascript
import { ref, reactive } from ''vue''

const count = ref(0)
const state = reactive({
  name: ''Marie'',
  age: 25
})
```

## 计算属性

使用`computed`创建计算属性：

```javascript
import { computed } from ''vue''

const doubleCount = computed(() => count.value * 2)
```

## 生命周期钩子

在Composition API中使用生命周期：

```javascript
import { onMounted, onUnmounted } from ''vue''

onMounted(() => {
  console.log(''组件已挂载'')
})

onUnmounted(() => {
  console.log(''组件即将卸载'')
})
```

## 组合函数

创建可复用的逻辑：

```javascript
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return { count, increment, decrement }
}
```

## 最佳实践

1. 使用组合函数提取可复用逻辑
2. 保持组件简洁专注
3. 合理使用ref和reactive
4. 利用TypeScript获得更好的类型支持

享受Vue 3的强大功能！⚡', 
'zh', 'published', datetime('now'), NULL, 'vue,composition-api,javascript,前端', datetime('now'), datetime('now'));

-- Insert post statistics for nzmarie posts
INSERT OR IGNORE INTO post_stats (id, post_id, title, views, likes, ai_questions, ai_summaries, language)
VALUES 
('marie-stat-1-en', 'marie-post-1-en', 'Introduction to Modern Web Development', 150, 12, 5, 3, 'en'),
('marie-stat-2-en', 'marie-post-2-en', 'React Hooks: A Deep Dive', 230, 18, 8, 4, 'en'),
('marie-stat-3-en', 'marie-post-3-en', 'CSS Grid vs Flexbox: When to Use Which', 180, 15, 6, 2, 'en'),
('marie-stat-1-zh', 'marie-post-1-zh', '现代Web开发入门', 120, 10, 4, 2, 'zh'),
('marie-stat-2-zh', 'marie-post-2-zh', 'Vue 3 Composition API 深入解析', 200, 16, 7, 3, 'zh');

-- Insert daily statistics for nzmarie
INSERT OR IGNORE INTO daily_stats (id, userId, date, language, pageViews, uniqueVisitors, reads, likes, comments)
VALUES 
('marie-daily-1', 'nzmarie', date('now', '-7 days'), 'en', 45, 32, 28, 5, 2),
('marie-daily-2', 'nzmarie', date('now', '-6 days'), 'en', 52, 38, 31, 6, 3),
('marie-daily-3', 'nzmarie', date('now', '-5 days'), 'en', 38, 29, 25, 4, 1),
('marie-daily-4', 'nzmarie', date('now', '-4 days'), 'en', 61, 42, 35, 7, 4),
('marie-daily-5', 'nzmarie', date('now', '-3 days'), 'en', 48, 35, 29, 5, 2),
('marie-daily-6', 'nzmarie', date('now', '-2 days'), 'en', 55, 40, 33, 6, 3),
('marie-daily-7', 'nzmarie', date('now', '-1 days'), 'en', 42, 31, 27, 4, 1),
('marie-daily-8', 'nzmarie', date('now', '-7 days'), 'zh', 35, 25, 22, 3, 1),
('marie-daily-9', 'nzmarie', date('now', '-6 days'), 'zh', 41, 30, 26, 4, 2),
('marie-daily-10', 'nzmarie', date('now', '-5 days'), 'zh', 28, 21, 18, 2, 0),
('marie-daily-11', 'nzmarie', date('now', '-4 days'), 'zh', 47, 33, 28, 5, 3),
('marie-daily-12', 'nzmarie', date('now', '-3 days'), 'zh', 39, 28, 24, 3, 1),
('marie-daily-13', 'nzmarie', date('now', '-2 days'), 'zh', 44, 32, 27, 4, 2),
('marie-daily-14', 'nzmarie', date('now', '-1 days'), 'zh', 33, 24, 20, 2, 1);

-- Insert feature toggles for nzmarie
INSERT OR IGNORE INTO feature_toggles (id, userId, key, enabled, payload)
VALUES 
('marie-toggle-1', 'nzmarie', 'dark_mode', 1, NULL),
('marie-toggle-2', 'nzmarie', 'comments_enabled', 1, NULL),
('marie-toggle-3', 'nzmarie', 'ai_assistant', 1, NULL),
('marie-toggle-4', 'nzmarie', 'analytics_tracking', 1, NULL);

-- Insert some sample comments for nzmarie's posts
INSERT OR IGNORE INTO comments (id, postId, authorName, authorEmail, content, status, createdAt)
VALUES 
('marie-comment-1', 'marie-post-1-en', 'John Doe', 'john@example.com', 'Great introduction to web development! Looking forward to more posts.', 'approved', datetime('now', '-2 days')),
('marie-comment-2', 'marie-post-2-en', 'Sarah Smith', 'sarah@example.com', 'Very helpful explanation of React Hooks. The examples are clear and practical.', 'approved', datetime('now', '-1 day')),
('marie-comment-3', 'marie-post-3-en', 'Mike Johnson', 'mike@example.com', 'Finally understand when to use Grid vs Flexbox. Thanks for the clear comparison!', 'approved', datetime('now', '-3 hours')),
('marie-comment-4', 'marie-post-1-zh', '李明', 'liming@example.com', '很好的Web开发入门文章，期待更多内容！', 'approved', datetime('now', '-1 day')),
('marie-comment-5', 'marie-post-2-zh', '王小红', 'wangxiaohong@example.com', 'Vue 3 Composition API讲解得很清楚，示例代码很实用。', 'approved', datetime('now', '-4 hours'));