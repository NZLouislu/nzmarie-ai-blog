export type PostStatus = 'draft' | 'published';

export type PostMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  status: PostStatus;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
  publishedAt?: string; // ISO when status === 'published'
};

export type Post = PostMeta & {
  content: string; // markdown
};
