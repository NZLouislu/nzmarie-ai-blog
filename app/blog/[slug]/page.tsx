import React from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/lib/types';
import BlogPostClient from './BlogPostClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  try {
    const { getBySlug } = await import('@/lib/posts');
    const post = getBySlug(slug, 'en');
    if (!post) {
      notFound();
    }
    return <BlogPostClient post={post} />;
  } catch (error) {
    console.error('Failed to get post:', error);
  }

  notFound();
}

export async function generateStaticParams() {
  try {
    const { listPublished } = await import('@/lib/posts');
    const posts = listPublished('en');
    return posts.map((post: Post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to get posts:', error);
  }

  return [];
}
