const RedisService = require('./redis-service');
const prefix = 'subscription';

function save(key, data) {
    return RedisService.set(`${prefix}/${key}`, data);
}

function del(key) {
    return RedisService.del(`${prefix}/${key}`);
}

function find(key) {
    return RedisService.get(`${prefix}/${key}`);
}

async function findAll() {
    const keys = await RedisService.keys(`${prefix}/*`);
    const all = [];
    keys.forEach(k => all.push(RedisService.get(k)));
    return Promise.all(all);
}

module.exports = { save, del, findAll, find };
