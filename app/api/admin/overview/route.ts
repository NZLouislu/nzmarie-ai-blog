import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const statsByLanguage = await prisma.postStat.groupBy({
      by: ['language'],
      _sum: {
        views: true,
        likes: true,
      },
      _count: {
        id: true,
      },
    });

    const overview = {
      en: { count: 0, views: 0, likes: 0 },
      zh: { count: 0, views: 0, likes: 0 },
    };

    statsByLanguage.forEach((stat) => {
      if (stat.language === 'en') {
        overview.en.count = stat._count.id;
        overview.en.views = stat._sum.views || 0;
        overview.en.likes = stat._sum.likes || 0;
      } else if (stat.language === 'zh') {
        overview.zh.count = stat._count.id;
        overview.zh.views = stat._sum.views || 0;
        overview.zh.likes = stat._sum.likes || 0;
      }
    });

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Failed to fetch overview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}