/**
 * @desc 推送公众号
 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const Wechat = require('wechat-mp-hack');
const Post = require('../models/post');

const API = new Wechat(Config.mp.username, Config.mp.password);

exports.push = async (res, userId) => {
    let replyEd = false;
    let replyId = '';
    let reply = (msg) => {
        if (replyEd) {
            API.singlesend(userId, msg, replyId);
        } else {
            res.reply(msg);
            replyEd = true;
        }
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
        let results2 = await Promise.all([API.operate_appmsg(results[0]), API.message(1)]);

        replyId = results2[1][0].id;

        let ok = await API.masssend(results2[0]);

        reply('群发成功');
    } catch (e) {
        console.log(e);
        reply(e);
    }
};