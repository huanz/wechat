/**
 * @desc 站点配置
 */
const AV = require('leanengine');

/**
 * @desc 获取配置信息
 */
exports.get = () => {
    let query = new AV.Query('Config');
    return query.first().then(data => data.attributes);
};
