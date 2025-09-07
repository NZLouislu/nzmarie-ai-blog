import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  try {
    const posts = getAllPosts();
    
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