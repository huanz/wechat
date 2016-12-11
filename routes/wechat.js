var wechat = require('wechat');
var config = {
    token: 'wechat',
    appid: 'wx950185c910864189',
    encodingAESKey: 'jvpVKAptdSpjLxoY5mXXhdDdt3SHsO4gYSmCt6iFlwb'
};

module.exports = wechat(config).text(function (message, req, res, next) {

}).link(function (message, req, res, next) {

}).middlewarify();