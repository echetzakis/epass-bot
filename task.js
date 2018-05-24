const processor = require('./app/services/processor');
const redis = require('./app/services/redis-service');

const redisOps = {};
if (process.env.REDIS_URL) {
    redisOps.url = process.env.REDIS_URL;
}

redis.connect(redisOps);

(async function() {
    const res = await processor.process();
    return res;
})().then(() => process.exit());


