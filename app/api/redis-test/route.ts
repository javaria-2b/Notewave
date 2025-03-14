import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function GET(request: NextRequest) {
  try {
    // Get operation from query params
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('op') || 'test';
    const key = searchParams.get('key') || 'test-key';
    const value = searchParams.get('value') || 'test-value';
    
    // Initialize Redis client
    console.log('Redis Test - Initializing Redis client');
    
    if (!process.env.REDIS_URL) {
      return NextResponse.json({ 
        error: 'REDIS_URL not configured',
        env: process.env.NODE_ENV
      }, { status: 500 });
    }
    
    const redis = new Redis(process.env.REDIS_URL);
    console.log('Redis Test - Client initialized');
    
    let result;
    let data;
    
    // Perform requested operation
    switch (operation) {
      case 'set':
        console.log(`Redis Test - Setting ${key}=${value}`);
        result = await redis.set(key, value);
        break;
      case 'get':
        console.log(`Redis Test - Getting ${key}`);
        data = await redis.get(key);
        break;
      case 'del':
        console.log(`Redis Test - Deleting ${key}`);
        result = await redis.del(key);
        break;
      case 'keys':
        console.log('Redis Test - Getting all keys');
        data = await redis.keys('*');
        break;
      default:
        // Run a simple test
        console.log('Redis Test - Running test sequence');
        const testKey = `test:${Date.now()}`;
        const testValue = `value:${Date.now()}`;
        
        // Set
        result = await redis.set(testKey, testValue);
        console.log(`Redis Test - SET result: ${result}`);
        
        // Get
        data = await redis.get(testKey);
        console.log(`Redis Test - GET result: ${data}`);
        
        // Verify
        const verified = data === testValue;
        console.log(`Redis Test - Verification: ${verified ? 'SUCCESS' : 'FAILED'}`);
        
        // Delete
        result = await redis.del(testKey);
        console.log(`Redis Test - DEL result: ${result}`);
    }
    
    // Close Redis connection
    await redis.quit();
    console.log('Redis Test - Connection closed');
    
    // Return results
    return NextResponse.json({
      operation,
      result,
      data,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Redis Test - Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    }, { status: 500 });
  }
} 