const puppeteer = require('puppeteer');

module.exports = class Pup {
    constructor() {
        
    }
    async start(url) {
        const browser = this.browser = await puppeteer.launch();
        const page = this.page = await browser.newPage();
        await page.goto(url);
        await page.evaluate(fs.readFileSync('./utils/jquery-3.3.1.min.js', 'utf8'));
        // 修正链接问题
        await page.evaluate(() => {
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
        });
    }
    async getData() {
        if (this.page) {
            let result = await this.page.evaluate(() => {
                return {
                    title: $('title').text().trim(),
                    thumb: __findImage(),
                    description: $('[name=description]').attr('content').trim(),
                    html: $('body').html()
                };
            });
            this.close();
            return result;
        }
    }
    close() {
        return this.browser && this.browser.close();
    }
}