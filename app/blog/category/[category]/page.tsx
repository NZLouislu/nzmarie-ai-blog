import React from 'react';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import CategoryContent from './CategoryContent';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(decodeURIComponent(category));

  if (posts.length === 0) {
    notFound();
  }

  return <CategoryContent category={category} posts={posts} />;
}

export async function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}