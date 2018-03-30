const nodemailer = require('nodemailer');
const Config = require('../models/config');

/**
 * extracting a list of property values
 *
 * @param {Array<Object>} arr
 * @param {String} key
 * @param {Boolean} leanCloud 特殊处理
 * @returns {Array} result
 */
const pluck = (arr, key, leanCloud) => {
    let result = [];
    arr.forEach(item => {
        if (item[key]) {
            leanCloud ? result.push(Object.assign({
                id: item.id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }, item[key])) : result.push(item[key]);
        }
    });
    return result;
};

/**
 * normalize host from www.noonme.com to noonme.com
 *
 * @param {String} host
 * @returns {String} host
 */
const normalizeHost = (host) => {
    let hostArr = host.split('.');
    if (hostArr[0] === 'www') {
        host = hostArr.slice(1).join('.');
    }
    return host;
};


const isObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test((id + '').trim());
};


exports.pluck = pluck;
exports.normalizeHost = normalizeHost;
exports.isObjectId = isObjectId;

/**
 * @desc 发送邮件
 */
exports.sendMail = async (html, subject = 'Mars Daily') => {
    const conf = await Config.get();
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: conf.mail.host,
            secureConnection: true, // use SSL
            port: 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: conf.mail.user,
                pass: conf.mail.pass
            }
        });
        transporter.sendMail({
            from: `"Mars" <${conf.mail.user}>`,
            to: conf.subscriber.join(','),
            subject: subject,
            html: html
        }, (error, info) => {
            error ? reject(error) : resolve(info);
        });
    });
};