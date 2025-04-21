const { Redis } = require('ioredis');

const redisClient = new Redis({
    host: 'localhost', // or your Redis server address
    port: 6379,        // your Redis server port
    maxRetriesPerRequest: null, // Set this to null
});

module.exports = redisClient;
