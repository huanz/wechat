'use strict';
const router = require('express').Router();

const Rule = require('../models/rule');

router.get('/', (req, res, next) => {
    res.render('rule');
}).post('/', (req, res, next) => {
    Rule.insert(req.body).then(function () {
        res.redirect('/post/share');
    }).catch(next);
});


module.exports = router;