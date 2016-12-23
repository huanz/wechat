'use strict';
const router = require('express').Router();

const Post = require('../models/post');

const parser = require('../utils/parser');

router.get('/', function (req, res, next) {
    Post.list().then(function (results) {
        res.render('post', {
            title: '文章列表',
            posts: results
        });
    }).catch(next);
}).post('/', function (req, res, next) {
    let url = req.body.url;
    if (url) {
        let title = req.body.title;
        let thumb = req.body.thumb;
        let description = req.body.description;
        parser.url(url, {
            title: !title,
            thumb: !thumb,
            description: !description
        }).then(function (result) {
            result.title = title || result.title;
            result.thumb = thumb || result.thumb;
            result.description = description || result.description;
            result.url = url;
            Post.insert(result).then(function (article) {
                res.redirect('/post');
            }).catch(next);
        });
    } else {
        res.redirect('/post/share');
    }
}).get('/share', function (req, res, next) {
    res.render('share', {
        title: '分享文章'
    });
});

module.exports = router;