const url = require('url');
const cheerio = require('cheerio');
const striptags = require('striptags');
const fetch = require('./fetch');

const parserHtml = (html, options) => {
    let result = {};
    let $ = cheerio.load(html, {
        decodeEntities: false
    });
    let opts = Object.assign({
        title: true,
        thumb: true,
        description: true
    }, options);

    if (opts.title) {
        result.title = $('title').text();
    }

    if (opts.description && $('meta[name="description"]').length) {
        result.description = $('meta[name="description"]').attr('content');
    }
    if (!$('meta[name="viewport"]').length) {
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">');
    }

    result.html = $.html();

    if (opts.thumb) {
        $('img').each(() => {
            let src = $(this).attr('src') || $(this).attr('data-src');
            if (src) {
                result.thumb = url.resolve(opts.url, src);
                return false;
            }
        });
    }
    return result;
};

const parserUrl = (link, options) => {
    return getHtml(link).then(html => {
        let value = res.headers['content-type'];
        options = options || {};
        options.url = link;
        return parserHtml(html, options);
    });
};

const getHtml = (link) => {
    return fetch(link).then(res => {
        let value = res.headers['content-type'];
        if (value.indexOf('text/html') > -1) {
            return res.body;
        } else {
            return Promise.reject('response not html');
        }
    });
};

const parserRule = (html, rule) => {
    let $ = cheerio.load(html, {
        decodeEntities: false
    });
    let result = {
        status: 1,
        title: eval(rule.title),
        html: eval(rule.html),
        thumb: eval(rule.thumb),
        description: (rule.description && eval(rule.description)) || ''
    };
    if (!result.description) {
        result.description = striptags(result.html).replace(/\s/g, '').substr(0, 256);
    }
    if (result.thumb.startsWith('//')) {
        result.thumb = 'https:' + result.thumb;
    }
    return result;
};

exports.html = parserHtml;
exports.url = parserUrl;
exports.rule = parserRule;
exports.get = getHtml;