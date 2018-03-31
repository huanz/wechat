/**
 * 文章
 */
const AV = require('leanengine');
const moment = require('moment');
const utils = require('../utils/utils');
/**
 * 插入一篇文章
 *
 * @param {Object} data
 * @returns {Promise}
 */
exports.insert = (data) => {
    const Post = AV.Object.extend('Post');
    let article = new Post();
    Object.keys(data).forEach(key => article.set(key, data[key]));
    article.set('view', 0);
    if (!data.status) {
        article.set('status', 0);
    }
    return article.save();
};

/**
 * 文章列表
 *
 * @returns {Promise}
 */
exports.list = () => {
    var query = new AV.Query('Post');
    query.descending('createdAt');
    return query.find().then(results => utils.pluck(results, 'attributes', true));
};

exports.getById = (id) => {
    let query = new AV.Query('Post');
    return query.get(id).then(result => {
        if (result) {
            return result.attributes;
        }
    });
};

exports.getByUrl = (url) => {
    let query = new AV.Query('Post');
    query.equalTo('url', url);
    return query.find().then(results => {
        if (results && results.length) {
            return results[0].attributes;
        } else {
            return undefined;
        }
    });
};

/**
 * @desc 获取本周文章：截止到上周五21：00前文章
 */
exports.getWeekPost = (limit) => {
    let query = new AV.Query('Post');
    let lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    query.greaterThanOrEqualTo('createdAt', lastWeek);
    query.exists('thumb');
    if (limit) {
        query.limit(limit);
    }
    return query.find().then(results => utils.pluck(results, 'attributes'));
};

/**
 * @desc 获取昨天文章
 */
exports.getYesterdayPost = () => {
    let query = new AV.Query('Post');
    let yesterday = moment().subtract(1, 'days').startOf('day').toDate();
    query.greaterThanOrEqualTo('createdAt', yesterday);
    return query.find().then(results => utils.pluck(results, 'attributes'));
};