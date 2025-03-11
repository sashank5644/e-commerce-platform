const Redis = require('ioredis');

// Get the Redis URL from environment variable (provided by Render)
const REDIS_URL = process.env.REDIS_URL;

let redis;

if (REDIS_URL) {
  console.log('Using REDIS_URL:', REDIS_URL);
  redis = new Redis(REDIS_URL); // ioredis handles rediss:// with TLS automatically
} else {
  console.log('REDIS_URL not set, using local Redis');
  const host = process.env.REDIS_HOST || 'localhost'; // Changed from 'redis' to 'localhost' for local testing
  const port = process.env.REDIS_PORT || 6379;
  console.log(`Using REDIS_HOST: ${host}, REDIS_PORT: ${port}`);
  redis = new Redis({
    host,
    port,
  });
}

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;