var request = require('request');
var CronJob = require('cron').CronJob;
var winston = require('winston');

module.exports.start = function () {
    // Every hour remove duplicate games from database
    new CronJob('* /15 * * * * *', function () {
        winston.info('Cleaner trigger !');

        request('http://localhost:8084/utils/cleaner/games/duplicates', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                winston.info('Cleaner - Games cleaned from duplicate !');
            }
        });
    }, null, true, "Europe/Paris");
}