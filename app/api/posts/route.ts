import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserIdFromRequest } from '../../../lib/middleware/auth';
import { getAllPosts } from '@/lib/posts';
import { getAllPostsFromDatabase } from '@/lib/database/posts';
import { getCached, setCached, CACHE_KEYS, TTL } from '../../../lib/cache/redis';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const urlUserId = searchParams.get('userId') || undefined;
    const language = searchParams.get('language') || 'en';
    const status = searchParams.get('status') || 'published';
    const q = searchParams.get('q') || '';

    const userId = getUserIdFromRequest(req, urlUserId);
    
    const cacheKey = CACHE_KEYS.USER_POSTS(userId, language);
    let posts = await getCached<Record<string, unknown>[]>(cacheKey);
    
    if (!posts) {
      // Try to get posts from database first, fallback to file system
      try {
        posts = await getAllPostsFromDatabase(language as 'en' | 'zh', userId);
        if (posts.length === 0) {
          // Fallback to file system posts if no database posts found
          posts = getAllPosts(language as 'en' | 'zh', userId);
        }
      } catch (error) {
        console.error('Database error, falling back to file system:', error);
        posts = getAllPosts(language as 'en' | 'zh', userId);
      }
      await setCached(cacheKey, posts, TTL.USER_POSTS);
    }
    
    let filteredPosts = posts;
    
    if (status !== 'all') {
      filteredPosts = posts.filter(post => post.status === status);
    }
    
    if (q) {
      filteredPosts = filteredPosts.filter(post => 
        (post.title as string).toLowerCase().includes(q.toLowerCase())
      );
    }
    
    const postData = filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      status: post.status || 'published',
      language: post.language || language,
      publishedAt: post.publishedAt || post.date,
      authorId: userId,
      author: post.author
    }));
    
    return NextResponse.json(postData);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, content, language, status, userId: bodyUserId } = body;
    
    const userId = getUserIdFromRequest(req, bodyUserId);
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const newPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      language: language || 'en',
      status: status || 'draft',
      authorId: userId,
      publishedAt: status === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      post: newPost 
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
});