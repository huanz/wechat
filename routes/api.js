'use strict';
const router = require('express').Router();
const Post = require('../models/post');

function success(res, data) {
    res.json({
        error: {
            returnCode: 0,
            returnMessage: 'success',
            returnUserMessage: '成功'
        },
        data: data
    });
}

router
    .get('/post', async (req, res, next) => {
        let posts = await Post.getByPage(req.query.page, req.query.limit);
        success(posts);
    })
    .get('/post/:id', async (req, res) => {
        let post = await Post.getById(req.params.id);
        success(post);
    });

module.exports = router;
