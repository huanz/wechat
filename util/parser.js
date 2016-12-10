var cheerio = require('cheerio');
var sizeOf = require('image-size');

var parser = function (html, options) {
    var result = {};
    var $ = cheerio.load(html);
    var opts = Object.assign({
        title: false,
        thumb: false
    }, options);

    if (opts.title) {
        result.title = $('title');
        if ($('h1').length) {
            result.title = $('h1').eq(0).text();
        }
    }
    if (opts.thumb) {
        $('img').each(function () {
            var url = $(this).attr('src');
            var dimensions = sizeOf(url);
            if (dimensions.width >= 300 && dimensions.height >= 300) {
                result.thumb = url;
            }
        });
    }
    if (!$('meta[name="viewport"]').length) {
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">');
    }
    result.html = $.html();
    return result;
};

module.exports = parser;