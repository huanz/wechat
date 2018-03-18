const AV = require('leanengine');

/**
 * 推送文章
 */
AV.Cloud.define('push', function (request, response) {
    response.success('Hello world!');
});

module.exports = AV.Cloud;