const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PORT } = process.env;

const redis = new Redis({
  host: REDIS_HOST || 'redis',
  port: REDIS_PORT || 6379,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;