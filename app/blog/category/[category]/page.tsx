import React from 'react';
import { notFound } from 'next/navigation';
import CategoryContent from './CategoryContent';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  try {
    const { getPostsByCategory } = await import('@/lib/posts');
    const posts = getPostsByCategory(category, 'en');
    if (posts.length === 0) {
      notFound();
    }
    return <CategoryContent category={category} posts={posts} />;
  } catch (error) {
    console.error('Failed to get posts:', error);
  }

  notFound();
}

export async function generateStaticParams() {
  try {
    const { getAllCategories, getPostsByCategory } = await import('@/lib/posts');
    const categories = getAllCategories('en');

    // Only generate categories that have content
    const validCategories = categories.filter((category: string) => {
      const posts = getPostsByCategory(category, 'en');
      return posts.length > 0;
    });

    return validCategories.map((category: string) => ({
      category: category.toLowerCase(),
    }));
  } catch (error) {
    console.error('Failed to get categories:', error);
  }

  return [];
}