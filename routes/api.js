'use strict';
const router = require('express').Router();
const Post = require('../models/post');

router.get('/', async (req, res, next) => {
    let posts = await Post.getWeekPost(8);
    res.json(posts);
});

module.exports = router;