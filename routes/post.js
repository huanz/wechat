'use strict';
const router = require('express').Router();

const Post = require('../models/post');

const parser = require('../utils/parser');
const utils = require('../utils/utils');

router.get('/', (req, res, next) => {
    Post.list().then((results) => {
        res.render('post', {
            title: '文章列表',
            posts: results
        });
    }).catch(next);
}).get('/:id', (req, res, next) => {
    let id = req.params.id.trim();
    if (utils.isObjectId(id)) {
        Post.getById(id).then(result => {
            res.render('show', {
                title: result.title,
                post: result
            });
        }).catch(next);
    } else {
        next();
    }
}).post('/', (req, res, next) => {
    let url = req.body.url;
    if (url) {
        let title = req.body.title;
        let thumb = req.body.thumb;
        let description = req.body.description;
        parser.url(url, {
            title: !title,
            thumb: !thumb,
            description: !description
        }).then((result) => {
            result.title = title || result.title;
            result.thumb = thumb || result.thumb;
            result.description = description || result.description;
            result.url = url;
            result.md = parser.html2md(result.html);
            Post.insert(result).then((article) => {
                res.redirect('/post');
            }).catch(next);
        });
    } else {
        res.redirect('/post/share');
    }
}).get('/share', (req, res, next) => {
    res.render('share', {
        title: '分享文章'
    });
});

module.exports = router;