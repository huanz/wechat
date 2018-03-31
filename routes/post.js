'use strict';
const router = require('express').Router();

const Post = require('../models/post');

const parser = require('../utils/parser');
const utils = require('../utils/utils');

router.get('/', async (req, res) => {
    const results = await Post.list();
    res.render('post', {
        title: '文章列表',
        posts: results
    });
}).get('/:id', async (req, res, next) => {
    let id = req.params.id.trim();
    if (utils.isObjectId(id)) {
        let result = await Post.getById(id);
        res.render('show', {
            title: result.title,
            post: result
        });
    } else {
        next();
    }
}).post('/', async (req, res, next) => {
    let url = req.body.url;
    if (url) {
        let title = req.body.title;
        let thumb = req.body.thumb;
        let description = req.body.description;
        let result = await parser.url(url, {
            title: !title,
            thumb: !thumb,
            description: !description
        });
        result.title = title || result.title;
        result.thumb = thumb || result.thumb;
        result.description = description || result.description;
        result.url = url;
        result.md = parser.html2md(result.html);
        let article = await Post.insert(result);
        res.redirect('/post');
    } else {
        res.redirect('/post/share');
    }
}).get('/share', (req, res, next) => {
    res.render('share', {
        title: '分享文章'
    });
});

module.exports = router;