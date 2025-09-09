import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get('i18n_lang')?.value || 'en';
    const posts = getAllPosts(lang as 'en' | 'zh');
    
    // Return only the id and title for each post
    const postData = posts.map(post => ({
      id: post.id,
      title: post.title
    }));
    
    return NextResponse.json(postData);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}