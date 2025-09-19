import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, canAccessUser } from '../auth/validate';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: 'admin' | 'user';
    name: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const token = authHeader.substring(7);
      const [username, password] = Buffer.from(token, 'base64').toString().split(':');
      
      const user = validateCredentials(username, password);
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      req.user = {
        id: user.id,
        role: user.role,
        name: user.name
      };

      return handler(req);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}

export function getUserIdFromRequest(req: AuthenticatedRequest, urlUserId?: string): string {
  if (!req.user) {
    throw new Error('User not authenticated');
  }

  if (req.user.role === 'admin' && urlUserId) {
    return urlUserId;
  }

  return req.user.id;
}

export function requireAdmin(req: AuthenticatedRequest): boolean {
  return req.user?.role === 'admin';
}

export function canUserAccess(req: AuthenticatedRequest, targetUserId: string): boolean {
  if (!req.user) return false;
  return canAccessUser(req.user.id, targetUserId);
}
