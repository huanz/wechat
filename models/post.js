var AV = require('leanengine');
var Post = AV.Object.extend('Post');

exports.insert = function (data) {
    var article = new Post();
    Object.keys(data).forEach(function (key) {
        article.set(key, data[key]);
    });
    article.set('view', 0);
    return article.save();
};

exports.list = function () {
    var query = new AV.Query(Post);
    query.descending('createdAt');
    return query.find();
};