import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserIdFromRequest } from '../../../../lib/middleware/auth';
import { getCached, setCached, CACHE_KEYS, TTL } from '../../../../lib/cache/redis';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const urlUserId = searchParams.get('userId') || undefined;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const language = searchParams.get('language') || 'en';

    const userId = getUserIdFromRequest(req, urlUserId);
    
    const period = from && to ? `${from}-${to}` : 'week';
    const cacheKey = CACHE_KEYS.USER_STATS(userId, period);
    let stats = await getCached<Record<string, unknown>>(cacheKey);
    
    if (!stats) {
      const mockStats = {
        userId,
        period,
        language,
        data: [
          {
            date: new Date().toISOString().split('T')[0],
            pageViews: Math.floor(Math.random() * 1000),
            uniqueVisitors: Math.floor(Math.random() * 500),
            reads: Math.floor(Math.random() * 300),
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 20)
          }
        ],
        totals: {
          pageViews: Math.floor(Math.random() * 5000),
          uniqueVisitors: Math.floor(Math.random() * 2500),
          reads: Math.floor(Math.random() * 1500),
          likes: Math.floor(Math.random() * 250),
          comments: Math.floor(Math.random() * 100)
        }
      };
      
      stats = mockStats;
      await setCached(cacheKey, stats, TTL.USER_STATS);
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
});
