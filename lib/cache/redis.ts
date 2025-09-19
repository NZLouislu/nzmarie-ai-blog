interface RedisClient {
  get: (key: string) => Promise<unknown>;
  setex: (key: string, ttl: number, value: string) => Promise<void>;
  del: (...keys: string[]) => Promise<void>;
  keys: (pattern: string) => Promise<string[]>;
}

const redis: RedisClient = {
  async get(key: string) {
    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
      headers: {
        'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });
    const data = await response.json();
    return data.result;
  },
  
  async setex(key: string, ttl: number, value: string) {
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/setex/${key}/${ttl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    });
  },
  
  async del(...keys: string[]) {
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/del`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(keys)
    });
  },
  
  async keys(pattern: string) {
    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/keys/${pattern}`, {
      headers: {
        'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });
    const data = await response.json();
    return data.result || [];
  }
};

export const CACHE_KEYS = {
  USER_POSTS: (userId: string, lang?: string) => 
    `posts:${userId}${lang ? `:${lang}` : ''}`,
  USER_STATS: (userId: string, period?: string) => 
    `stats:${userId}${period ? `:${period}` : ''}`,
  USER_FEATURES: (userId: string) => `features:${userId}`,
  ALL_USERS: 'users:all',
  SITE_CONFIG: 'config:site'
};

export const TTL = {
  USER_POSTS: 300, // 5 minutes
  USER_STATS: 900, // 15 minutes
  USER_FEATURES: 60, // 1 minute
  ALL_USERS: 1800, // 30 minutes
  SITE_CONFIG: 3600 // 1 hour
};

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const result = await redis.get(key);
    return result as T;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function redisRequest(command: string, args: unknown[] = []): Promise<unknown> {
  try {
    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/${command}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Redis request error:', error);
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redisRequest('setex', [key, ttl, JSON.stringify(value)]);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

export async function invalidateUserCache(userId: string, type: 'posts' | 'stats' | 'features'): Promise<void> {
  const patterns = {
    posts: [`posts:${userId}*`],
    stats: [`stats:${userId}*`],
    features: [`features:${userId}`]
  };
  
  try {
    const keys = await redis.keys(patterns[type][0]);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

export default redis;
