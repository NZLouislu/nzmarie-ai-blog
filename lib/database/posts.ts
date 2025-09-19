import { PrismaClient, PostStatus } from '@prisma/client';
import { Post } from '../types';

const prisma = new PrismaClient();

export async function getPostsByAuthor(authorId: string, language: 'en' | 'zh' = 'en', status: string = 'published'): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: authorId,
        language: language,
        ...(status !== 'all' && { status: status as PostStatus })
      },
      include: {
        author: true,
        postStats: true,
        comments: {
          where: { status: 'approved' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      language: post.language,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      coverImage: post.coverImage || undefined,
      tags: post.tags.split(',').filter(tag => tag.trim()),
      categories: [],
      excerpt: post.content.substring(0, 200) + '...',
      author: post.author.name,
      authorId: post.authorId
    }));
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    return [];
  }
}

export async function getAllPostsFromDatabase(language: 'en' | 'zh' = 'en', authorId?: string): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        language: language,
        ...(authorId && { authorId: authorId })
      },
      include: {
        author: true,
        postStats: true,
        comments: {
          where: { status: 'approved' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      language: post.language,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      coverImage: post.coverImage || undefined,
      tags: post.tags.split(',').filter(tag => tag.trim()),
      categories: [],
      excerpt: post.content.substring(0, 200) + '...',
      author: post.author.name,
      authorId: post.authorId
    }));
  } catch (error) {
    console.error('Error fetching all posts from database:', error);
    return [];
  }
}

export async function getPostBySlugFromDatabase(slug: string, language: 'en' | 'zh' = 'en', authorId?: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
        language: language,
        ...(authorId && { authorId: authorId })
      },
      include: {
        author: true,
        postStats: true,
        comments: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) return null;

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      language: post.language,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      coverImage: post.coverImage || undefined,
      tags: post.tags.split(',').filter(tag => tag.trim()),
      categories: [],
      excerpt: post.content.substring(0, 200) + '...',
      author: post.author.name,
      authorId: post.authorId
    };
  } catch (error) {
    console.error('Error fetching post by slug from database:', error);
    return null;
  }
}
