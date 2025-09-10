import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getPostBySlug } from '@/lib/posts';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const commentCounts = await prisma.postStat.findMany({
      select: {
        id: true,
        post_id: true,
        language: true,
        _count: { select: { comments: true } },
      },
    });
    console.log('PostStats with comment counts:', JSON.stringify(commentCounts, null, 2));

    const postsWithTitles = commentCounts.map(stat => {
      const post = getPostBySlug(stat.post_id, stat.language as 'en' | 'zh');
      return {
        ...stat,
        title: post ? post.title : `Post ${stat.post_id}`,
      };
    });
    console.log('Posts with titles for frontend:', JSON.stringify(postsWithTitles, null, 2));
    return NextResponse.json(postsWithTitles);
  } catch (error) {
    console.error('Failed to fetch comment counts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
