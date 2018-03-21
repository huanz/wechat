const request = require('request');

const _request = request.defaults({
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    }
});

const fetch = (url) => {
    return new Promise((resolve, reject) => {
        _request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(response);
            } else {
                reject(error);
            }
        });
    });
};

module.exports = fetch;