import React from 'react';
import { notFound } from 'next/navigation';
import { getBySlug, listPublished } from '@/lib/posts';
import { Post } from '@/lib/types';
import BlogPostClient from './BlogPostClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}

export async function generateStaticParams() {
  const posts = listPublished();

  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}
