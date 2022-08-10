const path = require('path');
const CONFIG_PREFIX='config.';
console.log(process.env.NODE_ENV);

//var env = CONFIG_PREFIX+ (process.env.NODE_ENV || 'test');
var env = CONFIG_PREFIX+ ('test');
env = env.toLowerCase();

// 载入配置文件
var file = path.resolve(__dirname, env);
try {
    var config = module.exports = require(file);
    console.log('Load config: [%s] %s', env, file);
} catch (err) {
    console.error('Cannot load config: [%s] %s', env, file);
    throw err;
}