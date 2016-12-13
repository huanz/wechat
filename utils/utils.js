/**
 * extracting a list of property values
 * 
 * @param {Array<Object>} arr
 * @param {String} key
 * @param {Boolean} leanCloud 特殊处理
 * @returns {Array} result
 */
var pluck = function (arr, key, leanCloud) {
    var result = [];
    arr.forEach(function (item) {
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


exports.pluck = pluck;