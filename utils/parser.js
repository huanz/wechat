const fs = require('fs');
const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');
const striptags = require('striptags');
const turndown = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');
const Rule = require('../models/rule');
const Config = require('../models/config');
const Crawler = require('./crawler');

const turndownService = new turndown();
turndownService.use(turndownPluginGfm.gfm);

/**
 * @desc html转markdown
 */
exports.html2md = (html) => {
    return turndownService.turndown(html);
};

function dataSource ($el) {
    return $el.attr('src') || $el.attr('data-src');
}

function fixLink ($, link) {
    ['href', 'src', 'data-src'].forEach((attr) => {
        $(`[${attr}]`).each(function () {
            let $this = $(this);
            let val = $this.attr(attr);
            if (val) {
                $this.attr(attr.replace('data-', ''), url.resolve(link, val));
                if ($this.get(0).tagName === 'iframe') {
                    let urlParams = new url.URLSearchParams(val);
                    let width = urlParams.get('width') || '100%';
                    let height = urlParams.get('height') || 'auto';
                    $this.attr('style', 'dispaly:block;max-width:100%;');
                    $this.attr('width', width);
                    $this.attr('height', height);
                }
            }
        });
    });
}

exports.htmlParser = async (postUrl, parseRule, options = {}) => {
    const response = await axios.get(postUrl);
    const contentType = response.headers['content-type'];
    if (contentType.indexOf('text/html') > -1) {
        let $ = cheerio.load(response.data, {
            decodeEntities: false
        });
        // 修复外链路径
        fixLink($, postUrl);
        
        let result = Object.assign({}, options);

        if (parseRule) {
            ['title', 'description', 'html', 'thumb'].forEach((key) => {
                if (!result[key] && parseRule[key]) {
                    try {
                        result[key] = eval(parseRule[key]);
                    } catch (error) {}
                }
            });
        } else {
            try {
                let ret = await mercuryParser(postUrl);
                Object.assign(ret, result);
                result = ret;
            } catch (error) {}
        }

        if (!result.title) {
            result.title = $('title').text();
        }

        if (!result.description) {
            if (result.html) {
                result.description = striptags(result.html).replace(/\s/g, '').substr(0, 256);
            } else if ($('meta[name="description"]').length) {
                result.description = $('meta[name="description"]').attr('content');
            }
        }

        if (!result.thumb) {
            $('img').each(function() {
                let src = dataSource($(this));
                if (src) {
                    result.thumb = url.resolve(postUrl, src);
                }
            });
        }

        if (!result.html) {
            if (!$('meta[name="viewport"]').length) {
                $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">');
            }
            result.html = $.html();
        }

        // trim
        for (let k in result) {
            if (result[k] && typeof result[k] === 'string') {
                result[k] = result[k].trim();
            }
        }
        
        return result;
    } else {
        throw 'response not html';
    }
};

const mercuryParser = async (postUrl) => {
    const conf = await Config.get();
    const mercury = await axios.get(`https://mercury.postlight.com/parser?url=${postUrl}`, {
        headers: {
            'x-api-key': conf.mercury
        }
    }).then(res => res.data);
    return {
        title: mercury.title,
        html: mercury.content,
        thumb: mercury.lead_image_url,
        description: mercury.excerpt
    };
};

exports.mercuryParser = mercuryParser;

exports.newParser = async (postUrl, parseRule) => {
    const crawler = new Crawler();
    if (parseRule) {
        console.log('start');
        await crawler.start(postUrl);
        console.log('start--end');

        let inject = `{title: ${parseRule.title}, html: ${parseRule.html}`;
        if (parseRule.description) {
            inject += `, description: ${parseRule.description}`;
        }
        if (parseRule.thumb) {
            inject += `, thumb: ${parseRule.thumb} || __findImage()`;
        }
        inject += '}';

        console.log('evaluate-->>>');
        const retObj = await crawler.evaluate(new Function(`return (${inject})`));
        console.log('evaluate-->>>end-----');
        console.log(retObj);
        if (retObj.title) {
            retObj.title = retObj.title.trim();
        }
        if (retObj.html) {
            retObj.html = retObj.html.trim();
        }
        if (!retObj.description) {
            retObj.description = striptags(retObj.html).replace(/\s/g, '').substr(0, 256);
        }
        return retObj;
    } else {
        try {
            let res = await mercuryParser(postUrl);
            return res;
        } catch (e) {
            console.log(e);
            await crawler.start(postUrl);
            const result = await crawler.getData();
            return result;
        }
    }
};