import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function GET() {
  try {
    // Check environment
    const environment = process.env.NODE_ENV || 'development';
    console.log('Health check - Current environment:', environment);
    
    // Check Redis connection
    let redisStatus = 'not_configured';
    let redisInfo = null;
    let redisTestResult = null;
    
    if (process.env.REDIS_URL) {
      console.log('Health check - REDIS_URL is configured');
      redisStatus = 'configured';
      
      try {
        // Create a temporary Redis client for the health check
        const redis = new Redis(process.env.REDIS_URL, {
          connectTimeout: 5000, // 5 seconds
          maxRetriesPerRequest: 1,
        });
        
        // Test Redis connection with a ping
        console.log('Health check - Testing Redis connection with PING');
        const pingResult = await redis.ping();
        console.log('Health check - Redis ping result:', pingResult);
        
        if (pingResult === 'PONG') {
          redisStatus = 'connected';
          
          // Get Redis info
          console.log('Health check - Getting Redis INFO');
          const info = await redis.info();
          const infoLines = info.split('\n');
          
          // Extract key information
          redisInfo = {
            version: infoLines.find(line => line.startsWith('redis_version'))?.split(':')[1]?.trim(),
            uptime: infoLines.find(line => line.startsWith('uptime_in_seconds'))?.split(':')[1]?.trim(),
            clients: infoLines.find(line => line.startsWith('connected_clients'))?.split(':')[1]?.trim(),
            memory: infoLines.find(line => line.startsWith('used_memory_human'))?.split(':')[1]?.trim(),
          };
          
          // Test write and read operations
          console.log('Health check - Testing Redis write/read operations');
          const testKey = `health:test:${Date.now()}`;
          const testValue = `health-check-${Date.now()}`;
          
          // Write test
          const setResult = await redis.set(testKey, testValue);
          console.log('Health check - Redis SET result:', setResult);
          
          // Read test
          const getResult = await redis.get(testKey);
          console.log('Health check - Redis GET result:', getResult);
          
          // Delete test key
          const delResult = await redis.del(testKey);
          console.log('Health check - Redis DEL result:', delResult);
          
          // Record test results
          redisTestResult = {
            write: setResult === 'OK',
            read: getResult === testValue,
            delete: delResult === 1,
            timestamp: new Date().toISOString()
          };
          
          redisStatus = redisTestResult.write && redisTestResult.read ? 'operational' : 'error';
        } else {
          redisStatus = 'error';
        }
        
        // Close the Redis connection
        await redis.quit();
        console.log('Health check - Redis connection closed');
      } catch (error) {
        console.error('Health check - Redis connection error:', error);
        redisStatus = 'error';
        redisTestResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        };
      }
    } else {
      console.warn('Health check - REDIS_URL not configured');
    }
    
    // Return health status
    return NextResponse.json({
      status: redisStatus === 'operational' ? 'ok' : 'warning',
      timestamp: new Date().toISOString(),
      environment,
      redis: {
        status: redisStatus,
        url_configured: !!process.env.REDIS_URL,
        info: redisInfo,
        test_result: redisTestResult
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 