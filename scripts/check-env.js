/**
 * Script to check environment variables for Redis configuration
 * Run with: node scripts/check-env.js
 */

console.log('Environment Variable Check');
console.log('=========================');
console.log('NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('REDIS_URL:', process.env.REDIS_URL ? '(set)' : '(not set)');

if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
  console.error('\n⚠️ WARNING: Running in production mode but REDIS_URL is not set!');
  console.error('Redis operations will fall back to localhost:6379, which may not be available.');
  console.error('\nTo fix this issue:');
  console.error('1. Set the REDIS_URL environment variable in your deployment platform');
  console.error('2. For Vercel: Add REDIS_URL in the Environment Variables section of your project settings');
  console.error('3. For other platforms: Refer to their documentation on setting environment variables');
  console.error('\nExample REDIS_URL format: redis://username:password@host:port');
  process.exit(1);
} else if (process.env.NODE_ENV === 'production') {
  console.log('\n✅ Production environment with Redis URL configured correctly');
} else {
  console.log('\nℹ️ Not running in production mode. Redis will not be used.');
}

console.log('\nTo test Redis connectivity, visit /api/health in your browser'); 