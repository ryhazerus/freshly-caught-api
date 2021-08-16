var cache = require('express-redis-cache');

const redisConnectionString = process.env.REDIS_URL.split(':');
const redisHost = redisConnectionString[0];
const redisPort = redisConnectionString[1];

var client = cache({
    host: redisHost,
    port: redisPort,
    auth_pass: process.env.REDIS_PASSWORD,
    expire: 5000
});

module.exports = client;