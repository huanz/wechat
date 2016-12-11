var url = require('url');
var cheerio = require('cheerio');
var probe = require('probe-image-size');
var async = require('async');

var parser = function (html, options) {
    return new Promise(function (resolve, reject) {
        var result = {};
        var $ = cheerio.load(html);
        var opts = Object.assign({
            title: false,
            thumb: false,
            description: false
        }, options);

        if (opts.title) {
            result.title = $('title').text();
            // if ($('h1').length) {
            //     result.title = $('h1').eq(0).text().replace(/\s/g, '');
            // }
        }

        if (opts.description && $('meta[name="description"]').length) {
            result.description = $('meta[name="description"]').attr('content');
        }
        if (!$('meta[name="viewport"]').length) {
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">');
        }

        result.html = $.html();

        if (opts.thumb) {
            async.some($('img').toArray(), function (element, callback) {
                var src = url.resolve(opts.url, $(element).attr('src'));
                probe(src).then(function (image) {
                    if (image.width >= 300 && image.height >= 300) {
                        result.thumb = src;
                        callback(null);
                    }
                });
            }, function (err) {
                resolve(result);
            });
        } else {
            resolve(result);
        }
    });
};

module.exports = parser;