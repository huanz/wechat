const fs = require('fs');
const url = require('url');
const axios = require('axios');
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

exports.newParser = async (postUrl, parseRule) => {
    const crawler = new Crawler(1);
    if (parseRule) {
        await crawler.start(postUrl);

        let inject = `{title: ${parseRule.title}, html: ${parseRule.html}`;
        if (parseRule.description) {
            inject += `, description: ${parseRule.description}`;
        }
        if (parseRule.thumb) {
            inject += `, thumb: ${parseRule.thumb} || __findImage()`;
        }
        inject += '}';

        const retObj = await crawler.evaluate(new Function(`return (${inject})`));
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
        } catch (e) {
            console.log(e);
            await crawler.start(postUrl);
            const result = await crawler.getData();
            return result;
        }
    }
};