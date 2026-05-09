const redisClient = require('../config/redis');

async function verifyRedisLink() {
  if (!redisClient) {
    return false;
  }

  if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
    return true;
  }

  try {
    await redisClient.connect();
    return true;
  } catch {
    return false;
  }
}

async function retrieveCachedData(key) {
  const isConnected = await verifyRedisLink();

  if (!isConnected) {
    return null;
  }

  try {
    const payload = await redisClient.get(key);
    return payload ? JSON.parse(payload) : null;
  } catch {
    return null;
  }
}

async function storeCachedData(key, value, ttlSeconds = 120) {
  const isConnected = await verifyRedisLink();

  if (!isConnected) {
    return;
  }

  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Silent fail - continue without cache
  }
}

async function invalidateCacheEntries(pattern) {
  const isConnected = await verifyRedisLink();

  if (!isConnected) {
    return;
  }

  try {
    const keys = await redisClient.keys(pattern);

    if (keys.length) {
      await redisClient.del(keys);
    }
  } catch {
    // Silent fail - continue without cache clearing
  }
}

module.exports = {
  getCachedValue: retrieveCachedData,
  setCachedValue: storeCachedData,
  clearByPattern: invalidateCacheEntries
};
