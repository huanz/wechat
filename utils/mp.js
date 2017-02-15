/**
 * @desc 推送公众号
 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const Wechat = require('wechat-mp-hack');
const Post = require('../models/post');

const API = new Wechat(Config.mp.username, Config.mp.password);

exports.push = async (res) => {
    let reply = (msg) => {
        res.reply(msg);
    };
    API.once('scan.login', (filepath) => {
        // 登录二维码图片地址
        API.qrdecode(filepath).then(result => reply(`点击链接确认登录：${result.text}`));
    });

    API.once('scan.send', (filepath) => {
        // 群发认证二维码地址
        API.qrdecode(filepath).then(result => reply(`点击链接确认群发：${result.text}`));
    });

    try {
        let results = await Promise.all([Post.getWeekPost(8), API.login()]);
        let appMsgId = await API.operate_appmsg(results[0]);
        let ok = await API.masssend(appMsgId);
        reply('群发成功');
    } catch (e) {
        reply(e);
    }
};