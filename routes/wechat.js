'use strict';
const url = require('url');
const wechat = require('wechat');
const Post = require('../models/post');
const Rule = require('../models/rule');
const parser = require('../utils/parser');
const mp = require('../utils/mp');
const urlParttern = /^https?:\/\/[^\s\.]+\.\S{2}\S*$/i;

module.exports = wechat(Config.wechat).text((message, req, res, next) => {
    let input = (message.Content || '').trim();
    if (input === '推送' && message.FromUserName === 'osl8HwPBTCsVbquNsnYbUfOQH8sM') {
        mp.push(res, message.FromUserName);
    } else if (urlParttern.test(input)) {
        let error = (e) => {
            console.log(e);
            res.reply('出错啦，木有推荐成功啊');
        };
        Post.getByUrl(input).then(p => {
            if (p && p.status) {
                res.reply([{
                    title: p.title,
                    description: p.description,
                    picurl: p.thumb,
                    url: input
                }]);
            } else {
                let parsed = url.parse(input);
                Promise.all([parser.get(input), Rule.getByHost(parsed.host)]).then(results => {
                    let r = results[1];
                    let result = {
                        url: input,
                        weixin: message
                    };
                    if (r && r.length) {
                        let curRule = r[0];
                        if (r.length > 1) {
                            r.some((element) => {
                                if (element.path && parsed.path && new RegExp(element.path).test(parsed.path)) {
                                    curRule = element;
                                    return true;
                                }
                            });
                        }
                        Object.assign(result, parser.rule(results[0], curRule, input));
                    } else if (!p) {
                        Object.assign(result, parser.html(results[0]));
                    }
                    if (!p || !p.status) {
                        Post.insert(result).then(() => {
                            res.reply([{
                                title: result.title,
                                description: result.description,
                                picurl: result.thumb,
                                url: input
                            }]);
                        }).catch(error);
                    }
                }).catch(error);
            }
        }).catch(error);
    } else {
        res.reply('直接发送文章链接即可推荐文章给我哦~~~');
    }
}).middlewarify();