/**
 * @desc 定时任务
 */
const schedule = require('node-schedule');

const Mp = require('../models/mp');

exports.push = (options) => {
    let rule = new schedule.RecurrenceRule();
    Object.assign(rule, options);
    return schedule.scheduleJob(rule, Mp.push);
};