import { NextResponse } from 'next/server';
import { listPublished } from '@/lib/posts';

export async function GET() {
  try {
    const posts = listPublished();

    // Transform posts to match the expected format for search
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.description || '',
      createdAt: post.createdAt,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}