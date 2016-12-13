var WechatAPI = require('wechat-api');
var schedule = require('./schedule');

/**
 * @desc 每天定时推送
 */
var push = function () {
    var api = new WechatAPI(Config.wechat.appid, Config.wechat.appsecret);
    return schedule.day('21', function () {
        
    });
};

module.exports = push;