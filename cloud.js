const AV = require('leanengine');
const moment = require('moment');
const nunjucks = require('nunjucks');

const Utils = require('./utils/utils');
const Post = require('./models/post');

/**
 * 发送邮件
 */
AV.Cloud.define('sendMail', async (request, response) => {
    let posts = await Post.getYesterdayPost();
    let today = moment().format('YYYY-MM-DD');
    let html = nunjucks.render('daily', {
        date: today,
        posts: posts
    });
    return Utils.sendMail(html);
});

module.exports = AV.Cloud;