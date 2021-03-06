/**
 * 文章
 */
const AV = require('leanengine');
const moment = require('moment');
const utils = require('../utils/utils');

function pickId(obj) {
    let ret = Object.assign({id: obj.id}, obj.toJSON());
    ret.weixin = null;
    return ret;
}
/**
 * 插入一篇文章
 *
 * @param {Object} data
 * @returns {Promise}
 */
exports.insert = async (data) => {
    /**
     * @desc 检测链接是否已存在
     */
    const query = new AV.Query('Post');
    query.equalTo('url', data.url);
    const has = await query.first();
    
    if (has) {
        return has;
    } else {
        let Post = AV.Object.extend('Post');
        let article = new Post();
        Object.keys(data).forEach(key => article.set(key, data[key]));
        article.set('view', 0);
        if (!data.status) {
            article.set('status', 0);
        }
        return article.save();
    }
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
    return query.get(id).then(result => pickId(result));
};

exports.getByUrl = (url) => {
    let query = new AV.Query('Post');
    query.equalTo('url', url);
    return query.find().then(results => {
        if (results && results.length) {
            return pickId(results[0]);
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
    query.descending('createdAt');
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
    query.descending('createdAt');
    return query.find().then(results => utils.pluck(results, 'attributes'));
};

/**
 * @desc 分页获取文章
 */
exports.getByPage = async (page = 1, limit = 15) => {
    let query = new AV.Query('Post');
    query.skip(((page - 1) || 0) * limit);
    query.limit(limit);
    query.descending('createdAt');

    let res = await Promise.all([query.find(), query.count()]);

    return {
        list: res[0].map(res => pickId(res)),
        total: res[1],
        limit: limit,
        page: page,
        totalPage: Math.ceil(res[1] / limit)
    };
};