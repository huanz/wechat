'use strict';
var router = require('express').Router();

var Rule = require('../models/rule');

router.get('/', (req, res, next) => {
    res.render('rule');
}).post('/', (req, res, next) => {
    Rule.insert(res.body).then(function () {
        res.redirect('/post/share');
    }).catch(next);
});


module.exports = router;