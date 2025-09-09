import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { listPublished } from '@/lib/posts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const cookieStore = await cookies();
    const lang = cookieStore.get('i18n_lang')?.value || 'en';
    const posts = listPublished(lang as 'en' | 'zh');

    // Filter posts based on search query
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );

    // Transform posts to match the expected format
    const transformedPosts = filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.description || '',
      createdAt: post.createdAt,
      image: post.image,
      author: post.author,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}