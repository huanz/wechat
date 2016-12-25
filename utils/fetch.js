const request = require('request');

const fetch = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(response);
            } else {
                reject(error);
            }
        });
    });
};

module.exports = fetch;