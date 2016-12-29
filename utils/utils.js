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
    if (hostArr.length === 3 && hostArr[0] === 'www') {
        host = hostArr[1] + hostArr[2];
    }
    return host;
};


exports.pluck = pluck;
exports.normalizeHost = normalizeHost;