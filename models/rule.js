/**
 * 文章提取规则
 */
var AV = require('leanengine');
var Rule = AV.Object.extend('Rule');

/**
 * 新建规则
 * 
 * @param {Object} data
 * @returns {Promise}
 */
exports.insert = function (data) {
    var r = new Rule();
    Object.keys(data).forEach(function (key) {
        r.set(key, data[key]);
    });
    return r.save();
};

/**
 * 新建规则
 * 
 * @param {String} id
 * @param {Object} data
 * @returns {Promise}
 */
exports.update = function (id, data) {
    var r = AV.Object.createWithoutData('Rule', id);
    Object.keys(data).forEach(function (key) {
        r.set(key, data[key]);
    });
    return r.save();
};

/**
 * 通过id查询规则
 * 
 * @param {String} id
 * @returns {Promise}
 */
exports.getById = function (id) {
    var query = new AV.Query('Rule');
    return query.get(id);
};

/**
 * 通过host查询规则
 * 
 * @param {String} host
 * @returns {Promise}
 */
exports.getByHost = function (host) {
    var query = new AV.Query('Rule');
    query.equalTo('host', host);
    return query.find();
};
