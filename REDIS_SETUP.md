# Redis Setup Guide

This application uses Redis for data storage in production. This guide will help you set up and configure Redis for your deployment.

## Why Redis?

Redis is used to store user data such as notes and folders in production. It provides:
- Persistent storage across deployments
- Better performance than localStorage
- Ability to scale across multiple instances

## Configuration

### Environment Variables

The application requires the following environment variable in production:

- `REDIS_URL`: The connection URL for your Redis instance

Example format: `redis://username:password@host:port` or `rediss://username:password@host:port` (for SSL)

### Setting Up Redis

#### Option 1: Using Vercel KV (Recommended for Vercel deployments)

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Connect Store" and select "KV Database"
5. Follow the setup instructions
6. Vercel will automatically add the `REDIS_URL` environment variable

#### Option 2: Using Upstash Redis

1. Create an account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the Redis connection string (format: `rediss://default:password@hostname:port`)
4. Add it as `REDIS_URL` in your environment variables

#### Option 3: Self-hosted Redis

1. Install Redis on your server
2. Configure Redis for remote access (if needed)
3. Set the `REDIS_URL` environment variable to point to your Redis instance

## Verifying Redis Connection

After deployment, you can verify your Redis connection using the built-in tools:

### Health Check Endpoint

1. Visit `/api/health` in your browser
2. Check the Redis status in the response
3. If it shows "operational", your Redis setup is working correctly

### Redis Test Page

We've added a Redis test page to help diagnose any issues:

1. Visit `/redis-test` in your browser
2. The page will automatically check Redis health
3. You can run various Redis operations directly from this page:
   - Test basic Redis functionality
   - Set specific keys and values
   - Get values for specific keys
   - Delete keys
   - List all keys in the database

This test page is a valuable tool for verifying that Redis is working correctly and for debugging any issues.

## Troubleshooting

### Redis Connection Issues

If you're experiencing Redis connection issues:

1. Check that `REDIS_URL` is correctly set
2. Verify the format of your Redis URL (should be `redis://` or `rediss://`)
3. Ensure your Redis instance is running and accessible
4. Check for any network restrictions or firewall rules
5. Use the `/redis-test` page to run diagnostics

### Data Not Being Saved

If data isn't being saved to Redis:

1. Check the browser console for any error messages
2. Look at your server logs for Redis connection errors
3. Use the `/redis-test` page to test write operations
4. Verify that your Redis instance has enough memory
5. Ensure write permissions are correctly configured

## Monitoring Redis Usage

You can monitor your Redis usage through:

1. Your Redis provider's dashboard (Vercel KV, Upstash, etc.)
2. Redis CLI commands like `INFO` and `MONITOR`
3. The `/api/health` endpoint which provides basic Redis stats
4. Third-party monitoring tools

## Local Development

For local development, the application now uses Redis if the `REDIS_URL` environment variable is set.

To test Redis locally:

1. Install Redis on your development machine
2. Set `REDIS_URL=redis://localhost:6379` in your `.env.local` file
3. Run the application with `npm run start:check` 