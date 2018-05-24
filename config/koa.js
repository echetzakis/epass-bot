const compress = require('koa-compress')
    , logger = require('koa-logger')
    , bodyParser = require('koa-bodyparser')
    , router = require('koa-router')()
    , controllers = { StatusController: require('../app/controllers/status-controller') };


const routes = {
    get: {
        '/': controllers.StatusController.ping,
        '/about': controllers.StatusController.about
    }
};

module.exports = function (app) {
    // Logger
    app.use(logger());

    //JSON Body Parser
    app.use(bodyParser());

    // Register GET actions
    Object.keys(routes.get).forEach(function (path, index) {
        console.log("adding route:", path);
        router.get(path, routes.get[path]);
    });

    app.use(router.routes());
};
