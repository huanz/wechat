const puppeteer = require('puppeteer');
const nightmare = require('nightmare');

module.exports = class Crawler {
    /**
     * 
     * @param {number} type 默认0使用nightmare 1使用puppeteer
     */
    constructor(type = 0) {
        this.type = type;
    }
    async start(url) {
        let _injectjs = './utils/jquery-3.3.1.min.js';
        let _injects = function() {
            ['href', 'src'].forEach(attr => {
                $(`[${attr}]`).each(function () {
                    $(this).attr(attr, this[attr]);
                });
            });
            window.__findImage = function () {
                return window.$('img').filter(function () {
                    return $(this).width() >= 50 && $(this).height() >= 50;
                }).eq(0).attr('src');
            };
        };
        if (this.type === 0) {
            this.nightmare = new nightmare().goto(url).inject('js', _injectjs).evaluate(_injects);
        } else {
            let browser = this.browser = await puppeteer.launch();
            let page = this.page = await browser.newPage();
            await page.goto(url);
            // await page.waitFor(5000);
            await page.evaluate(fs.readFileSync(_injectjs, 'utf8'));
            await page.evaluate(_injects);
        }
        return this;
    }
    evaluate(...args) {
        if (this.nightmare) {
            return this.nightmare.evaluate(...args).end().then(res => res);
        } else {
            return this.page.evaluate(...args).then(res => {
                this.close();
                return res;
            });
        }
    }
    getData() {
        return this.evaluate(() => {
            return {
                title: $('title').text().trim(),
                thumb: __findImage(),
                description: $('[name=description]').attr('content').trim(),
                html: $('body').html()
            };
        })
    }
    close() {
        return this.browser && this.browser.close();
    }
}