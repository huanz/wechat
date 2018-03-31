'use strict';
const router = require('express').Router();

const Rule = require('../models/rule');
const utils = require('../utils/utils');

router.get('/', (req, res, next) => {
    res.render('rule');
}).post('/', async (req, res, next) => {
    req.body.host = utils.normalizeHost(req.body.host);
    await Rule.insert(req.body);
    res.redirect('/post/share');
});

module.exports = router;