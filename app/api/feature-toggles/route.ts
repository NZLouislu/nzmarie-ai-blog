import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserIdFromRequest } from '../../../lib/middleware/auth';
import { getCached, setCached, CACHE_KEYS, TTL } from '../../../lib/cache/redis';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const urlUserId = searchParams.get('userId') || undefined;

    const userId = getUserIdFromRequest(req, urlUserId);
    
    const cacheKey = CACHE_KEYS.USER_FEATURES(userId);
    let features = await getCached<Record<string, unknown>>(cacheKey);
    
    if (!features) {
      features = {
        userId,
        toggles: {
          'dark-mode': { enabled: false, payload: null },
          'beta-features': { enabled: false, payload: null },
          'analytics': { enabled: true, payload: { provider: 'google' } },
          'comments': { enabled: true, payload: null },
          'ai-assistant': { enabled: true, payload: null }
        }
      };
      
      await setCached(cacheKey, features, TTL.USER_FEATURES);
    }
    
    return NextResponse.json(features);
  } catch (error) {
    console.error('Failed to fetch feature toggles:', error);
    return NextResponse.json({ error: 'Failed to fetch feature toggles' }, { status: 500 });
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body: Record<string, unknown> = await req.json();
    // const updates = (body as { updates?: Record<string, boolean> }).updates;
    const { key, enabled, payload, userId: bodyUserId } = body as { key?: string; enabled?: boolean; payload?: unknown; userId?: string };
    
    const userId = getUserIdFromRequest(req, bodyUserId);
    
    if (!key) {
      return NextResponse.json(
        { error: 'Feature key is required' },
        { status: 400 }
      );
    }
    
    const cacheKey = CACHE_KEYS.USER_FEATURES(userId);
    const features = await getCached<{ userId: string; toggles: Record<string, { enabled: boolean; payload: unknown }> }>(cacheKey) || { userId, toggles: {} };
    
    features.toggles[key] = {
      enabled: enabled !== undefined ? enabled : false,
      payload: payload || null
    };
    
    await setCached(cacheKey, features, TTL.USER_FEATURES);
    
    return NextResponse.json({ 
      success: true, 
      feature: features.toggles[key] 
    });
  } catch (error) {
    console.error('Failed to update feature toggle:', error);
    return NextResponse.json({ error: 'Failed to update feature toggle' }, { status: 500 });
  }
});
