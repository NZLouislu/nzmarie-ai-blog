import { Post } from './types';

export const posts: Post[] = [
  {
    id: '1',
    slug: 'hello-world',
    title: 'Hello World — 从 Hugo 到 Next',
    excerpt: '把旧 Hugo 博客迁移到 Next.js + Radix UI 的路线与取舍。',
    tags: ['migrate', 'nextjs', 'radix'],
    status: 'published',
    createdAt: '2025-08-10T03:00:00.000Z',
    updatedAt: '2025-08-10T03:00:00.000Z',
    publishedAt: '2025-08-10T08:00:00.000Z',
    content: `# 迁移目标
- 保留原有信息结构：列表页 / 文章页 / 标签
- 新增：草稿、再次编辑发布、登录后评论（未来）
    
\`\`\`bash
npx create-next-app@latest
\`\`\`
`,
  },
  {
    id: '2',
    slug: 'ai-writing-pipeline',
    title: 'AI 辅助写作流水线（草稿）',
    excerpt: '用提示词 + 关键词生成初稿，再人工编辑校对与再发布。',
    tags: ['ai', 'workflow'],
    status: 'draft',
    createdAt: '2025-08-12T03:00:00.000Z',
    updatedAt: '2025-08-12T05:10:00.000Z',
    content: `这是草稿：未来将接入 AI 接口，基于提示词生成初稿，再人工润色。`,
  },
];

export function listPublished() {
  return posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt ?? b.updatedAt).getTime() - new Date(a.publishedAt ?? a.updatedAt).getTime());
}

export function getBySlug(slug: string) {
  return posts.find(p => p.slug === slug) ?? null;
}
