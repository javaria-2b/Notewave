/**
 * Redis Test Script
 * 
 * This script tests direct Redis operations to verify the connection and data storage.
 * Run with: node scripts/test-redis.js
 */

const Redis = require('ioredis');

// Use the Redis URL directly for testing
const REDIS_URL = 'rediss://default:AWbvAAIjcDFlY2FiY2JlNjljOTA0YmI1YTkxOWE0MTQ4YjIyY2FiZHAxMA@pleasing-narwhal-26351.upstash.io:6379';

async function testRedis() {
  console.log('Redis Test Script');
  console.log('=================');
  
  console.log(`Using Redis URL: ${REDIS_URL.substring(0, REDIS_URL.indexOf('@') > 0 ? REDIS_URL.indexOf('@') : 10)}...`);
  
  try {
    // Connect to Redis
    console.log('Connecting to Redis...');
    const redis = new Redis(REDIS_URL);
    
    // Test connection
    console.log('Testing connection...');
    const pingResult = await redis.ping();
    console.log(`PING result: ${pingResult}`);
    
    if (pingResult !== 'PONG') {
      throw new Error('Redis connection failed: PING did not return PONG');
    }
    
    // Test user data operations
    const userId = 'test-user-' + Date.now();
    const userPrefix = `user:${userId}:`;
    
    console.log(`\nTesting user data operations with userId: ${userId}`);
    
    // Test folders
    const foldersKey = `${userPrefix}folders`;
    const defaultFolder = {
      id: 'default',
      name: 'My Notes',
      createdAt: new Date().toISOString()
    };
    
    console.log(`\nSaving folder to ${foldersKey}`);
    const foldersSaveResult = await redis.set(foldersKey, JSON.stringify([defaultFolder]));
    console.log(`Folders save result: ${foldersSaveResult}`);
    
    console.log(`Getting folders from ${foldersKey}`);
    const foldersData = await redis.get(foldersKey);
    const folders = JSON.parse(foldersData);
    console.log(`Retrieved folders: ${folders.length} folders`);
    console.log(folders);
    
    // Test notes
    const notesKey = `${userPrefix}notes`;
    const testNote = {
      id: 'test-note-' + Date.now(),
      title: 'Test Note',
      description: 'This is a test note',
      date: new Date().toISOString(),
      folderId: 'default',
      content: 'Test note content'
    };
    
    console.log(`\nSaving note to ${notesKey}`);
    const notesSaveResult = await redis.set(notesKey, JSON.stringify([testNote]));
    console.log(`Notes save result: ${notesSaveResult}`);
    
    console.log(`Getting notes from ${notesKey}`);
    const notesData = await redis.get(notesKey);
    const notes = JSON.parse(notesData);
    console.log(`Retrieved notes: ${notes.length} notes`);
    console.log(notes);
    
    // Clean up test data
    console.log('\nCleaning up test data...');
    await redis.del(foldersKey);
    await redis.del(notesKey);
    
    // List all keys for this test user
    console.log(`\nVerifying cleanup - listing keys for ${userPrefix}*`);
    const remainingKeys = await redis.keys(`${userPrefix}*`);
    console.log(`Remaining keys: ${remainingKeys.length}`);
    if (remainingKeys.length > 0) {
      console.log(remainingKeys);
    }
    
    // Close Redis connection
    console.log('\nClosing Redis connection...');
    await redis.quit();
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('\nError during Redis test:', error);
    process.exit(1);
  }
}

// Run the test
testRedis().catch(console.error); 