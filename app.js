const Koa = require('koa')
    , app = new Koa()
    , env = process.env.NODE_ENV || 'development'
    , koa_configure = require('./config/koa')
    , port = process.env.PORT || 3050
    , path = require('path')
    , fs = require('fs')
    , rootPath = path.normalize(__dirname);


if ((env === 'development' || process.env.LOAD_ENV === 'true') && fs.existsSync(rootPath + '/.env')) {
    //load .env
    require('dotenv').load();
}

koa_configure(app);

app.listen(port);
console.info("Server listening:\t" + port);

