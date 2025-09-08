import React from 'react';
import { notFound } from 'next/navigation';
import TagContent from './TagContent.tsx';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;

  try {
    const { getPostsByTag } = await import('@/lib/posts');
    const posts = getPostsByTag(tag, 'en');
    if (posts.length === 0) {
      notFound();
    }
    return <TagContent tag={tag} posts={posts} />;
  } catch (error) {
    console.error('Failed to get posts:', error);
  }

  notFound();
}

export async function generateStaticParams() {
  try {
    const { getAllTags, getPostsByTag } = await import('@/lib/posts');
    const tags = getAllTags('en');

    // Only generate tags that have content
    const validTags = tags.filter((tag: string) => {
      const posts = getPostsByTag(tag, 'en');
      return posts.length > 0;
    });

    return validTags.map((tag: string) => ({
      tag: tag.toLowerCase(),
    }));
  } catch (error) {
    console.error('Failed to get tags:', error);
  }

  return [];
}