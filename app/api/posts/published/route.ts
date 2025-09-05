import { NextResponse } from 'next/server';
import { listPublished } from '@/lib/posts';

export async function GET() {
  try {
    const posts = listPublished();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}