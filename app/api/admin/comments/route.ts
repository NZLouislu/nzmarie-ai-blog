import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const language = searchParams.get('language');

    const where: Prisma.CommentWhereInput = {};
    if (postId) where.post_id = postId;
    if (language) where.language = language;

    const comments = await prisma.comment.findMany({
      where,
      select: {
        id: true,
        post_id: true,
        name: true,
        email: true,
        comment: true,
        is_anonymous: true,
        created_at: true,
        language: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}