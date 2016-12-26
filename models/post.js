/**
 * 文章
 */
const AV = require('leanengine');
const Post = AV.Object.extend('Post');

const utils = require('../utils/utils');

/**
 * 插入一篇文章
 *
 * @param {Object} data
 * @returns {Promise}
 */
exports.insert = (data) => {
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

exports.getByUrl = (url) => {
    let query = new AV.Query('Post');
    query.equalTo('url', url);
    return query.find().then(r => {
        if (r && r.length) {
            return r[0].attributes;
        } else {
            return undefined;
        }
    });
};