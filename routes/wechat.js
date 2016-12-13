'use strict';
var wechat = require('wechat');
var Post = require('../models/post');
var parser = require('../utils/parser');
var config = {
    token: 'wechat',
    appid: 'wx950185c910864189',
    encodingAESKey: 'jvpVKAptdSpjLxoY5mXXhdDdt3SHsO4gYSmCt6iFlwb'
};
var urlParttern = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

module.exports = wechat(config).text(function (message, req, res, next) {
    var input = (message.Content || '').trim();
    if (urlParttern.test(input)) {
        parser.url(input).then(function (result) {
            result.url = input;
            result.weixin = message;
            Post.insert(result).then(function (article) {
                res.reply([{
                    title: result.title,
                    description: result.description,
                    picurl: result.thumb,
                    url: input
                }]);
            }).catch(next);
        }).catch(next);
    } else {
        next();
    }
}).middlewarify();
