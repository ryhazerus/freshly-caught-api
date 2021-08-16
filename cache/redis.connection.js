const cache = require('express-redis-cache');
const redis = require("redis");

const client = cache(redis.createClient(process.env.REDIS_URL));

module.exports = client;