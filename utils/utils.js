/**
 * extracting a list of property values
 *
 * @param {Array<Object>} arr
 * @param {String} key
 * @param {Boolean} leanCloud 特殊处理
 * @returns {Array} result
 */
const pluck = (arr, key, leanCloud) => {
    let result = [];
    arr.forEach(item => {
        if (item[key]) {
            leanCloud ? result.push(Object.assign({
                id: item.id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }, item[key])) : result.push(item[key]);
        }
    });
    return result;
};

/**
 * normalize host from www.w3cboy.com to w3cboy.com
 *
 * @param {String} host
 * @returns {String} host
 */
const normalizeHost = (host) => {
    let hostArr = host.split('.');
    if (hostArr[0] === 'www') {
        host = hostArr.slice(1).join('.');
    }
    return host;
};


const isObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test((id + '').trim());
};


exports.pluck = pluck;
exports.normalizeHost = normalizeHost;
exports.isObjectId = isObjectId;