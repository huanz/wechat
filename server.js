'use strict';
const AV = require('leanengine');

const app = require('./app');

AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT, () => {
    console.log('Node app is running, port:', PORT);
    process.on('uncaughtException', function (err) {
        console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function (reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
});