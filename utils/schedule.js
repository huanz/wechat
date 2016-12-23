/**
 * @desc 定时任务
 */
const schedule = require('node-schedule');

exports.day = function (hour, callback) {
    let rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    return schedule.scheduleJob(rule, callback);
};
