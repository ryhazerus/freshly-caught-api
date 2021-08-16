var cache = require('express-redis-cache');
const redis = require("redis");

var client = cache(redis.createClient(process.env.REDIS_URL));

module.exports = client;