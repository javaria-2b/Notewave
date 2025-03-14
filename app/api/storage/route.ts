import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import Redis from 'ioredis';

// Initialize Redis client
let redis: Redis | null = null;

// Log environment information
console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('REDIS_URL configured:', !!process.env.REDIS_URL);

// Always use Redis if REDIS_URL is available
if (process.env.REDIS_URL) {
  try {
    // Direct connection using the provided URL
    // Make sure the URL format is correct for Upstash (should start with rediss://)
    const redisUrl = process.env.REDIS_URL;
    console.log('Redis URL format check:', redisUrl.startsWith('rediss://') ? 'Secure (rediss)' : 'Standard (redis)');
    
    redis = new Redis(redisUrl);
    
    console.log('Redis client initialized');
    
    // Test the connection
    redis.on('connect', () => {
      console.log('Successfully connected to Redis');
      
      // Test write operation
      if (redis) {
        redis.set('connection_test', 'connected_at_' + new Date().toISOString())
          .then(result => {
            console.log('Redis test write result:', result);
          })
          .catch(err => {
            console.error('Redis test write failed:', err);
          });
      }
    });
    
    redis.on('error', (err: Error) => {
      console.error('Redis connection error:', err);
    });
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
  }
} else {
  console.warn('REDIS_URL not configured, Redis will not be initialized');
}

// User-specific prefix for Redis keys
const getUserPrefix = (userId: string): string => `user:${userId}:`;

// GET handler for retrieving data
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const user = await stackServerApp.getUser();
    if (!user) {
      console.error('GET /api/storage: Unauthorized - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get key from URL
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      console.error('GET /api/storage: Missing key parameter');
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    // Get data from Redis if available
    let data = null;
    if (redis) {
      const redisKey = `${getUserPrefix(user.id)}${key}`;
      console.log(`GET /api/storage: Fetching data from Redis with key: ${redisKey}`);
      
      try {
        const redisData = await redis.get(redisKey);
        if (redisData) {
          console.log(`GET /api/storage: Data found in Redis for key: ${redisKey}`);
          data = JSON.parse(redisData);
        } else {
          console.log(`GET /api/storage: No data found in Redis for key: ${redisKey}`);
        }
      } catch (error) {
        console.error(`GET /api/storage: Redis error for key ${redisKey}:`, error);
      }
    } else {
      console.log('GET /api/storage: Redis not available');
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/storage:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler for saving data
export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const user = await stackServerApp.getUser();
    if (!user) {
      console.error('POST /api/storage: Unauthorized - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get data from request body
    const { key, data } = await request.json();
    
    if (!key) {
      console.error('POST /api/storage: Missing key parameter');
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    // Save data to Redis if available
    if (redis) {
      const redisKey = `${getUserPrefix(user.id)}${key}`;
      console.log(`POST /api/storage: Saving data to Redis with key: ${redisKey}`);
      
      try {
        // Convert data to JSON string
        const jsonData = JSON.stringify(data);
        console.log(`POST /api/storage: JSON data length: ${jsonData.length} characters`);
        
        // Save to Redis
        const result = await redis.set(redisKey, jsonData);
        console.log(`POST /api/storage: Redis SET result: ${result}`);
        
        if (result !== 'OK') {
          console.error(`POST /api/storage: Redis SET failed with result: ${result}`);
          return NextResponse.json({ error: 'Failed to save data to Redis' }, { status: 500 });
        }
        
        console.log(`POST /api/storage: Successfully saved data in Redis with key: ${redisKey}`);
      } catch (error) {
        console.error(`POST /api/storage: Redis error for key ${redisKey}:`, error);
        return NextResponse.json({ error: 'Redis operation failed' }, { status: 500 });
      }
    } else {
      console.error('POST /api/storage: Redis not available');
      return NextResponse.json({ error: 'Redis not available' }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/storage:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler for removing data
export async function DELETE(request: NextRequest) {
  try {
    // Get user from session
    const user = await stackServerApp.getUser();
    if (!user) {
      console.error('DELETE /api/storage: Unauthorized - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get key from URL
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      console.error('DELETE /api/storage: Missing key parameter');
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    // Delete data from Redis if available
    if (redis) {
      const redisKey = `${getUserPrefix(user.id)}${key}`;
      console.log(`DELETE /api/storage: Deleting data from Redis with key: ${redisKey}`);
      
      try {
        const result = await redis.del(redisKey);
        console.log(`DELETE /api/storage: Redis DEL result: ${result}`);
        
        if (result === 0) {
          console.warn(`DELETE /api/storage: No data found to delete for key: ${redisKey}`);
        } else {
          console.log(`DELETE /api/storage: Successfully deleted data from Redis with key: ${redisKey}`);
        }
      } catch (error) {
        console.error(`DELETE /api/storage: Redis error for key ${redisKey}:`, error);
        return NextResponse.json({ error: 'Redis operation failed' }, { status: 500 });
      }
    } else {
      console.error('DELETE /api/storage: Redis not available');
      return NextResponse.json({ error: 'Redis not available' }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/storage:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 