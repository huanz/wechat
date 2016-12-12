'use strict';
var wechat = require('wechat');
var config = {
    token: 'wechat',
    appid: 'wx950185c910864189',
    encodingAESKey: 'jvpVKAptdSpjLxoY5mXXhdDdt3SHsO4gYSmCt6iFlwb'
};

module.exports = wechat(config).text(function (message, req, res, next) {
    console.log(message);
    // message extra
    // {
    //     ToUserName: 'gh_c904de91dc7f',
    //     FromUserName: 'osl8HwPBTCsVbquNsnYbUfOQH8sM',
    //     CreateTime: '1481521205',
    //     MsgType: 'text',
    //     Content: 'http://baidu.com',
    //     MsgId: '6363085124227969973'
    // }
    res.reply('推荐成功');
}).link(function (message, req, res, next) {
    console.log(message);
    res.reply('推荐成功');
}).middlewarify();
