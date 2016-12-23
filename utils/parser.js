const url = require('url');
const cheerio = require('cheerio');
const fetch = require('./fetch');

const parserHtml = function (html, options) {
    let result = {};
    let $ = cheerio.load(html);
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
        $('img').each(function () {
            var src = $(this).attr('src') || $(this).attr('data-src');
            if (src) {
                result.thumb = url.resolve(opts.url, src);
                return false;
            }
        });
    }
    return result;
};

const parserUrl = function (link, options) {
    return fetch(link).then(function (res) {
        let value = res.headers['content-type'];
        if (value.indexOf('text/html') > -1) {
            options = options || {};
            options.url = link;
            return parserHtml(res.body, options);
        } else {
            return Promise.reject('response not html');
        }
    });
};

exports.html = parserHtml;
exports.url = parserUrl;