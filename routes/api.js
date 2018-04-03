'use strict';
const router = require('express').Router();
const Post = require('../models/post');

router
    .get('/post', async (req, res, next) => {
        let posts = await Post.getByPage(req.query.page, req.query.limit);
        res.json(posts);
    })
    .get('/post/:id', async (req, res) => {
        let post = await Post.getById(req.params.id);
        res.json(post);
    });

module.exports = router;
