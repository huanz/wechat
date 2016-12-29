'use strict';
const router = require('express').Router();

const Rule = require('../models/rule');
const utils = require('../utils/utils');

router.get('/', (req, res, next) => {
    res.render('rule');
}).post('/', (req, res, next) => {
    req.body.host = utils.normalizeHost(req.body.host);
    Rule.insert(req.body).then(() => {
        res.redirect('/post/share');
    }).catch(next);
});

module.exports = router;