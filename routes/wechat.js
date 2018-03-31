'use strict';
const url = require('url');
const wechat = require('wechat');
const AV = require('leanengine');
const Post = require('../models/post');
const Rule = require('../models/rule');
const parser = require('../utils/parser');
const mp = require('../utils/mp');
const urlParttern = /^https?:\/\/[^\s\.]+\.\S{2}\S*$/i;

module.exports = wechat(Config.wechat).text(async (message, req, res, next) => {
    let input = (message.Content || '').trim();
    // 链接
    if (urlParttern.test(input)) {
        try {
            let p = await Post.getByUrl(input);
            if (p && p.status) {
                res.reply([{
                    title: p.title,
                    description: p.description,
                    picurl: p.thumb,
                    url: input
                }]);
            } else {
                let parsed = url.parse(input);
                let result = {
                    url: input,
                    weixin: message
                };
                // 获取解析规则
                let parseRule = await Rule.getByHost(parsed.host);
                let postRule = null;
                if (parseRule && parseRule.length) {
                    let postRule = parseRule[0];
                    if (parseRule.length > 1) {
                        parseRule.some((element) => {
                            if (element.path && parsed.path && new RegExp(element.path).test(parsed.path)) {
                                postRule = element;
                                return true;
                            }
                        });
                    }
                }
                let output = await parser.newParser(input, postRule);
                Object.assign(result, output);
                if (!p || !p.status) {
                    let ret = await Post.insert(result);
                    res.reply([{
                        title: result.title,
                        description: result.description,
                        picurl: result.thumb,
                        url: input
                    }]);
                }
            }
        } catch (error) {
            console.log(error);
            res.reply('出错啦，木有推荐成功啊');
        }
    } else if (message.FromUserName === 'osl8HwPBTCsVbquNsnYbUfOQH8sM') {
        switch(input) {
            case '发邮件':
                AV.Cloud.run('sendMail');
                break;
            case '群发':
                mp.push(res, message.FromUserName);
                break;
            default:
                res.reply('直接发送文章链接即可推荐文章给我哦~~~');
                break;
        }
    } else {
        res.reply('直接发送文章链接即可推荐文章给我哦~~~');
    }
}).middlewarify();