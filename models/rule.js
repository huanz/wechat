/**
 * 文章提取规则
 */
const AV = require('leanengine');
const Rule = AV.Object.extend('Rule');

const utils = require('../utils/utils');
/**
 * 新建规则
 *
 * @param {Object} data
 * @returns {Promise}
 */
exports.insert = (data) => {
    let r = new Rule();
    Object.keys(data).forEach(key => r.set(key, data[key]));
    return r.save();
};

/**
 * 新建规则
 *
 * @param {String} id
 * @param {Object} data
 * @returns {Promise}
 */
exports.update = (id, data) => {
    let r = AV.Object.createWithoutData('Rule', id);
    Object.keys(data).forEach(key => r.set(key, data[key]));
    return r.save();
};

/**
 * 通过id查询规则
 *
 * @param {String} id
 * @returns {Promise}
 */
exports.getById = (id) => {
    let query = new AV.Query('Rule');
    return query.get(id);
};

/**
 * 通过host查询规则
 *
 * @param {String} host
 * @returns {Promise}
 */
exports.getByHost = (host) => {
    let query = new AV.Query('Rule');
    query.equalTo('host', host);
    return query.find().then(r => {
        if (r && r.length) {
            return utils.pluck(r, 'attributes', true);
        } else {
            return undefined;
        }
    });
};
