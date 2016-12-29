const fs = require('fs');
const path = require('path');
const request = require('request');
const WechatAPI = require('wechat-api');
const Post = require('./post');

const Api = new WechatAPI(Config.wechat.appid, Config.wechat.appsecret);

const uploadMedia = (src) => {
    return new Promise((resolve, reject) => {
        let fileurl = path.join(__dirname, Date.now() + '.jpg');
        request.get(src).on('response', () => {
            Api.uploadMedia(fileurl, 'image', (err, result) => {
                err ? reject(err) : resolve(result);
            });
        }).on('error', (err) => {
            reject(err);
        }).pipe(fs.createWriteStream(fileurl));
    });
};

const uploadNews = (news) => {
    return new Promise((resolve, reject) => {
        Api.uploadNews(news, (err, result) => {
            err ? reject(err) : resolve(result);
        });
    });
};

const massSendNews = (mediaId, receivers) => {
    return new Promise((resolve, reject) => {
        Api.massSendNews(mediaId, receivers, (err, result) => {
            err ? reject(err) : resolve(result);
        });
    });
};

const push = () => {
    let error = (e) => {
        console.log(e);
    };
    Post.getWeekPost(8).then(posts => {
        let promiseArr = [];
        let news = {
            articles: []
        };
        posts.forEach(item => {
            promiseArr.push(uploadMedia(item.thumb));
            news.articles.push({
                author: 'bukas',
                title: item.title,
                content_source_url: item.url,
                content: item.html,
                digest: item.description,
                show_cover_pic: 1
            });
        });
        Promise.all(promiseArr).then(results => {
            for(let i = 0; i < results.length; i++) {
                news.articles[i].thumb_media_id = results[i].media_id;
            }
            uploadNews(news).then(result => {
                massSendNews(result.media_id, true).catch(error);
            }).catch(error);
        }).catch(error);
    });
}

exports.uploadMedia = uploadMedia;
exports.uploadNews = uploadNews;
exports.massSendNews = massSendNews;
exports.push = push;