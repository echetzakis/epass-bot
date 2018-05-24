const pkg = require('../../package.json');

const StatusController = {
    about(ctx) {
        ctx.body = {
            name: pkg.name,
            version: pkg.version,
            description: pkg.description
        };
    },

    ping(ctx) {
        ctx.body = 'ok';
        ctx.status = 200;
    }
};


module.exports = StatusController;

