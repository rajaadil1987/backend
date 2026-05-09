const crypto = require('crypto');
globalThis.crypto = crypto;

require('dotenv').config();

const app = require('./app');
const initializeDatabase = require('./config/db');
const env = require('./config/env');
const { validateRedisConnection } = require('./config/redis');
const { prepareContainer } = require('./config/azure-storage');

async function startServer() {
  try {
    console.log('🚀 Starting application...');

    app.listen(env.port, () => {
      console.log(`🌐 Server running on port ${env.port}`);
    });
    // Connect to database first
    console.log('Connecting to database...');
    await initializeDatabase();
    console.log('Database connected successfully');

    // Ensure Azure Blob container exists
    console.log('Preparing Azure Blob container...');
    await prepareContainer();
    console.log('Azure Blob container ready');

    // Validate Redis connection
    console.log(' Validating Redis connection...');
    const redisConnected = await validateRedisConnection();

    if (!redisConnected) {
      console.warn(' Redis is not connected - application will run without caching');
      console.warn('   To enable Redis, add these to your .env file:');
      console.warn('   REDIS_HOST=your-redis-host');
      console.warn('   REDIS_PORT=10000');
      console.warn('   REDIS_PASSWORD=your-redis-password');
      console.warn('   See .env.example for configuration examples');
    } else {
      console.log('Redis connection validated');
    }
    // Start the server
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
