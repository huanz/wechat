var request = request('request');

var fetch = function (url) {
    return new Promise(function(resolve, reject){
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};

module.exports = fetch;