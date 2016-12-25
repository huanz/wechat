const WechatAPI = require('wechat-api');
const schedule = require('./schedule');

/**
 * @desc 每天定时推送
 */
const push = () => {
    let api = new WechatAPI(Config.wechat.appid, Config.wechat.appsecret);
    return schedule.day('21', () => {

    });
};

module.exports = push;