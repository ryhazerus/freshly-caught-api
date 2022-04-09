const cache = require('express-redis-cache');
const redis = require("redis");
let client = null;

if (process.env.NODE_ENV !== 'test') {
    client = cache(redis.createClient(process.env.REDIS_URL));
}

module.exports = client;