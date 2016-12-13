/**
 * 文章
 */
var AV = require('leanengine');
var Post = AV.Object.extend('Post');

var utils = require('../utils/utils');

/**
 * 插入一篇文章
 * 
 * @param {Object} data
 * @returns {Promise}
 */
exports.insert = function (data) {
    var article = new Post();
    Object.keys(data).forEach(function (key) {
        article.set(key, data[key]);
    });
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
exports.list = function () {
    var query = new AV.Query('Post');
    query.descending('createdAt');
    return query.find().then(function (results) {
        return utils.pluck(results, 'attributes', true);
    });
};