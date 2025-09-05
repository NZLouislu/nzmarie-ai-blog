export type PostStatus = 'draft' | 'published';

export type PostMeta = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  excerpt: string;
  tags: string[];
  categories: string[];
  status: PostStatus;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
  publishedAt?: string; // ISO when status === 'published'
};

export type Post = PostMeta & {
  content: string; // markdown
  image?: string;
  author?: string;
};
