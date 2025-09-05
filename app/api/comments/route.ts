import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, name, email, comment, isAnonymous } = await request.json();

    if (!postId || !comment) {
      return NextResponse.json({ error: 'Post ID and comment are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        post_id: postId,
        name: isAnonymous ? null : name,
        email: isAnonymous ? null : email,
        comment,
        is_anonymous: isAnonymous
      }
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}