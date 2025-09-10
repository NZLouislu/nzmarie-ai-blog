import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import CategoryContent from './CategoryContent';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { category } = resolvedParams;
  const lang = resolvedSearchParams.lang;
  const h = await headers();
  const locale = h.get('x-locale') || 'en';
  const language = (lang || locale || 'en') as 'en' | 'zh';

  try {
    const { getPostsByCategory } = await import('@/lib/posts');
    const posts = await getPostsByCategory(category, language);
    
    if (posts.length === 0) {
      notFound();
    }
    
    return <CategoryContent category={category} posts={posts} language={language} />;
  } catch (error) {
    console.error('Failed to get posts:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const { getAllCategories, getPostsByCategory } = await import('@/lib/posts');
    const languages = ['en', 'zh'] as const;
    
    const allParams: { category: string; lang: string }[] = [];
    
    for (const language of languages) {
      const categories = await getAllCategories(language as 'en' | 'zh');
      for (const category of categories) {
        const posts = await getPostsByCategory(category, language as 'en' | 'zh');
        if (posts.length > 0) {
          allParams.push({
            category: category.toLowerCase(),
            lang: language
          });
        }
      }
    }
    
    return allParams;
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}