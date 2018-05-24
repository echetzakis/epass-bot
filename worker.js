const processor = require('./app/services/processor');
const redis = require('./app/services/redis-service');

const redisOps = {};
if (process.env.REDIS_URL) {
    redisOps.url = process.env.REDIS_URL;
}

redis.connect(redisOps);

function interval() {
    let interval = 5;
    let fromEnv = Number.parseInt(process.env.WORKER_INTERVAL);
    if (isNaN(fromEnv) || fromEnv < 1) {
        console.warn(`WORKER_INTERVAL is not valid, falling back to: ${interval}min`);
    } else {
        console.info(`WORKER_INTERVAL is set to: ${fromEnv}min`);
        interval = fromEnv;
    }
    return interval * 60 * 1000;//millis
}

//Call once on start
processor.process();
//Schedule
setInterval(processor.process, interval());
