/**
 * @desc 定时任务
 */
var schedule = require('node-schedule');

exports.day = function (hour, callback) {
    var rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    return schedule.scheduleJob(rule, callback);
};
