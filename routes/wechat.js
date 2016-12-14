'use strict';
var wechat = require('wechat');
var Post = require('../models/post');
var parser = require('../utils/parser');
var urlParttern = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

module.exports = wechat(Config.wechat).text(function (message, req, res, next) {
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
            }).catch(function () {
                res.reply('出错啦，木有推荐成功啊');
            });
        }).catch(function () {
            res.reply('出错啦，木有推荐成功啊');
        });
    } else {
        res.reply('直接发送文章链接即可推荐文章给我哦~~~');
    }
}).middlewarify();
