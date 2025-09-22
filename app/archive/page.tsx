import React from 'react';
import { headers } from 'next/headers';
import ArchiveClient from './ArchiveClient';

export default async function ArchivePage() {
  const headersList = await headers();
  const language = headersList.get('x-locale') || 'en';

  // Fetch posts on server side
  const { listPublished } = await import('@/lib/posts');
  const allPosts = listPublished(language as 'en' | 'zh');

  // Group posts by year
  const postsByYear = allPosts.reduce((acc, post) => {
    const year = post.publishedAt
      ? new Date(post.publishedAt).getFullYear().toString()
      : new Date(post.createdAt).getFullYear().toString();

    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof allPosts>);

  return <ArchiveClient initialPosts={postsByYear} />;
}