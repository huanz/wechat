'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var fetch = require('../util/fetch');
var parser = require('../util/parser');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Post = AV.Object.extend('Post');

router.get('/', function (req, res, next) {
  var query = new AV.Query(Post);
  query.descending('createdAt');
  query.find().then(function (results) {
    res.render('post', {
      title: '文章列表',
      posts: results
    });
  }, function (err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('post', {
        title: '文章列表',
        post: results
      });
    } else {
      next(err);
    }
  }).catch(next);
}).post('/', function (req, res, next) {
  var url = req.body.url;
  if (url) {
    fetch(url).then(function (html) {
      var article = new Post();
      var title = req.body.title;
      var thumb = req.body.thumb;
      var result = parser(html, {
        title: !!title,
        thumb: !!thumb
      });
      article.set('title', title || result.title);
      article.set('thumb', title || result.thumb);
      article.set('html', result.html);
      article.set('url', url);
      article.set('view', 0);
      article.save().then(function (article) {
        res.redirect('/post');
      }).catch(next);
    });
  }
});

module.exports = router;
