'use strict';
const url = require('url');
const wechat = require('wechat');
const Post = require('../models/post');
const Rule = require('../models/rule');
const parser = require('../utils/parser');
const urlParttern = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

module.exports = wechat(Config.wechat).text(function (message, req, res, next) {
    let input = (message.Content || '').trim();
    if (urlParttern.test(input)) {
        let error = () => {
            res.reply('出错啦，木有推荐成功啊');
        };
        let parsed = url.parse(input);
        Rule.getByHost(parsed.host).then(r => {
            if (r) {
                let curRule = r[0];
            } else {
                parser.url(input).then(result => {
                    result.url = input;
                    result.weixin = message;
                    Post.insert(result).then(() => {
                        res.reply([{
                            title: result.title,
                            description: result.description,
                            picurl: result.thumb,
                            url: input
                        }]);
                    }).catch(error);
                })
            }
        }).catch(error);
    } else {
        res.reply('直接发送文章链接即可推荐文章给我哦~~~');
    }
}).middlewarify();
