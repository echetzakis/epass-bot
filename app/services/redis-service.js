const redis = require('redis')
    , lo = require('lodash')
    , url = require('url')
    , bluebird = require('bluebird');

const RedisService = {
    connect(options = {}) {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        this.namespace = options.namespace || "cache";
        this.options = options;
        const connString = options.url;
        const connOptions = {};
        delete options.url;
        if (connString) {
            if (lo.startsWith(connString, 'rediss://')) {
                connOptions.tls = { servername: url.parse(connString).hostname };
            }
            this.client = redis.createClient(connString, connOptions);
        } else {
            this.client = redis.createClient();
        }
        this.client.on('ready', () => {
            const db = connString ? (connString.split("@")[1] || connString) : 'localhost';
            console.info("Connected to redis: %s, tls: %s, options: %s", db, !lo.isNil(connOptions.tls), JSON.stringify(options));
        });
        this.client.on('error', (err) => {
            console.error(err);
        });
    },
    prefixKey(key) {
        return `${this.namespace}/${key}`;
    },
    async get(key) {
        let res = null;
        const namespacedKey = this.prefixKey(key);
        try {
            res = await this.client.getAsync(namespacedKey);
            console.debug((res ? "Cache hit for [%s]" : "Cache miss for [%s]"), namespacedKey);
        } catch (error) {
            console.error(error);
        }
        return JSON.parse(res);
    },
    async setex(key, value, expires = null) {
        let res = false;
        const expiration = expires || this.options.expiration || 60;
        const namespacedKey = this.prefixKey(key);
        try {
            const stringValue = JSON.stringify(value);
            await this.client.setAsync(namespacedKey, stringValue, 'EX', expiration);
            console.debug("Cached key [%s], valid for %s seconds", namespacedKey, expiration);
            res = true;
        } catch (error) {
            console.error(error);
        }
        return res;
    },
    async set(key, value) {
        let res = false;
        const namespacedKey = this.prefixKey(key);
        try {
            const stringValue = JSON.stringify(value);
            await this.client.setAsync(namespacedKey, stringValue);
            console.debug("Cached key [%s]", namespacedKey);
            res = true;
        } catch (error) {
            console.error(error);
        }
        return res;
    },
    async hset(key, field, value) {
        let res = false;
        const namespacedKey = this.prefixKey(key);
        try {
            const stringValue = JSON.stringify(value);
            await this.client.hsetAsync(namespacedKey, field, value);
            console.debug("Cached hash [%s]", namespacedKey);
            res = true;
        } catch (error) {
            console.error(error);
        }
        return res;
    },
    async hgetall(key) {
        let res = null;
        const namespacedKey = this.prefixKey(key);
        try {
            res = await this.client.hgetallAsync(namespacedKey);
            console.debug((res ? "Cache hit for [%s]" : "Cache miss for [%s]"), namespacedKey);
        } catch (error) {
            console.error(error);
        }
        return res;
    },
    async hdel(key, field) {
        let res = false;
        const namespacedKey = this.prefixKey(key);
        try {
            const deleted = await this.client.hdelAsync(namespacedKey, field);
            res = deleted > 0;
            console.debug((res ? "Deleted field [%s] from cached hash [%s]" : "Cache miss for field [%s] of hash [%s]"), field, namespacedKey);
        } catch (error) {
            console.error(error);
        }
        return res;
    },
    async del(key) {
        let res = false;
        const namespacedKey = this.prefixKey(key);
        try {
            const deleted = await this.client.delAsync(namespacedKey);
            res = deleted > 0;
            console.debug((res > 0 ? "Deleted key [%s] from cache" : "Cache miss for key [%s]"), namespacedKey);
        } catch (error) {
            console.error(error);
        }
        return res;
    },
    async keys(pattern) {
        let res = [];
        const namespacedKey = this.prefixKey(pattern);
        try {
            res = await this.client.keysAsync(namespacedKey);
            console.debug((res > 0 ? "Deleted key [%s] from cache" : "Cache miss for key [%s]"), namespacedKey);
        } catch (error) {
            console.error(error);
        }
        return res.map(k => k.slice(this.namespace.length + 1) );
    },

};

module.exports = RedisService;
