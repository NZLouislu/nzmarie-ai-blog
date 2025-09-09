# 语言切换器实现文档

## 概述

本博客项目实现了支持英语（en）和中文（zh）两种语言的语言切换功能。通过 Zustand 状态管理库处理语言状态，使用 cookies 实现语言偏好持久化。内容存储在语言特定的目录中（`lib/post/en` 和 `lib/post/zh`），并通过 Next.js 的静态生成（SSG）为两种语言预生成页面。

此功能确保用户可以无缝切换语言，内容根据当前语言动态加载，同时保持 SEO 友好和性能优化。

## 核心组件和实现

### 1. 状态管理（Zustand）

语言状态通过 Zustand 存储在 `lib/stores/languageStore.ts` 中。

**关键代码：**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
);
```

- `language`：当前语言状态。
- `setLanguage`：切换语言的动作。
- `persist` 中间件：自动将状态持久化到 localStorage（浏览器端）。

在客户端组件中使用 `useLanguageStore` 获取和更新语言。

### 2. Cookies 持久化（服务器端）

为了在服务器渲染（SSR/SSG）时保持语言一致，使用 Next.js 的 `cookies()` API 从 cookies 中读取语言。

**示例（在页面组件中）：**
```typescript
import { cookies } from 'next/headers';

const cookieStore = await cookies();
const cookieLang = cookieStore.get('language')?.value;
const language = (lang || cookieLang || 'en') as 'en' | 'zh';
```

- 在导航栏切换语言时，设置 cookie：`document.cookie = \`language=${lang}; path=/; max-age=31536000\`;`。
- 服务器组件优先使用 URL 参数（`searchParams.lang`）或 cookie 作为 fallback。

### 3. 多语言内容获取

内容文件按语言组织在 `lib/post/en` 和 `lib/post/zh` 目录中。`lib/posts.ts` 提供语言特定的函数。

**关键函数：**
- `getAllPosts(language: 'en' | 'zh')`：获取指定语言的所有帖子。
- `getPostsByTag(tag: string, language: 'en' | 'zh')`：按标签过滤帖子。
- `getAllTags(language: 'en' | 'zh')`：获取指定语言的标签列表。
- `getPostBySlug(slug: string, language: 'en' | 'zh')`：获取指定帖子的内容。

这些函数使用 `getPostsDirectory(language)` 动态切换目录，并解析 Markdown 文件（使用 gray-matter）。

### 4. 静态生成（SSG）

使用 Next.js 的 `generateStaticParams` 为两种语言预生成页面路径。

**示例（标签页面 `app/blog/tag/[tag]/page.tsx`）：**
```typescript
export async function generateStaticParams() {
  const languages = ['en', 'zh'] as const;
  const allParams: { tag: string; lang: string }[] = [];
  
  for (const language of languages) {
    const tags = await getAllTags(language as 'en' | 'zh');
    for (const tag of tags) {
      const posts = await getPostsByTag(tag, language as 'en' | 'zh');
      if (posts.length > 0) {
        allParams.push({ tag, lang: language });
      }
    }
  }
  
  return allParams;
}
```

- 为每个语言和有效的标签/类别生成静态路径。
- 页面渲染时，根据当前语言从相应目录加载内容。
- 支持动态路由如 `/blog/tag/[tag]?lang=zh`。

类似地，博客详情页、类别页和首页也实现了语言特定的 SSG。

### 5. 页面和组件更新

- **Navbar（`components/Navbar.tsx`）**：添加语言切换按钮，使用 `useLanguageStore` 更新状态并设置 cookie。
- **博客详情页（`app/blog/[slug]/page.tsx`）**：根据语言加载帖子内容，支持客户端侧导航。
- **类别页（`app/blog/category/[category]/page.tsx`）**：语言特定帖子列表渲染。
- **标签页（`app/blog/tag/[tag]/page.tsx`）**：类似类别页，支持语言切换。
- **首页和搜索页**：动态根据语言过滤和显示内容。

所有内容组件（如 `TagContent.tsx`、`CategoryContent.tsx`）接收 `language` prop，用于本地化文本（如标题、日期格式）和内容渲染。

### 6. 路由和重定向

- 语言切换时，使用 Next.js 的 `useRouter` 或客户端导航保持 URL 参数（如 `?lang=zh`）。
- 静态生成确保两种语言的页面独立存在，避免重定向开销。

## 部署和优化

- **构建**：运行 `npm run build` 时，`generateStaticParams` 会为所有语言生成页面。
- **性能**：SSG 减少服务器负载；Zustand 轻量级状态管理。
- **SEO**：语言特定路径支持搜索引擎索引（可进一步优化为子目录如 `/en/blog/`）。
- **兼容性**：支持 TypeScript 类型安全，确保语言参数始终为 `'en' | 'zh'`。

## 测试指南

见后续测试部分。确保在开发（`npm run dev`）和生产构建中验证语言切换。

文档最后更新：2025-09-09