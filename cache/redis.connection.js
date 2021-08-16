var cache = require('express-redis-cache')

var client = cache({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASSWORD,
    expire: 5000
});

module.exports = client;