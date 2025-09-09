import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Post } from '@/lib/types';
import TagContent from './TagContent';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { getAllTags, getPostsByTag } = await import('@/lib/posts');
    const languages = ['en', 'zh'] as const;
    
    const allParams: { tag: string; lang: string }[] = [];
    
    for (const language of languages) {
      const tags = await getAllTags(language as 'en' | 'zh');
      for (const tag of tags) {
        const posts = await getPostsByTag(tag, language as 'en' | 'zh');
        if (posts.length > 0) {
          allParams.push({
            tag,
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

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { tag } = resolvedParams;
  const lang = resolvedSearchParams.lang;
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('i18n_lang')?.value;
  const language = (lang || cookieLang || 'en') as 'en' | 'zh';

  try {
    const { getPostsByTag } = await import('@/lib/posts');
    const posts = await getPostsByTag(tag, language) as Post[];
    
    if (posts.length === 0) {
      notFound();
    }
    
    return <TagContent tag={tag} posts={posts} />;
  } catch (error) {
    console.error('Failed to get posts:', error);
    notFound();
  }
}