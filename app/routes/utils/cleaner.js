module.exports = function () {
    var winston = require('winston');
    var express = require('express');
    var app = express();

    // Models
    var Game = require('../../models/game');

    // Enums
    var CODE = require('../../enums/codes');

    // Remove duplicate games
    app.get('/cleaner/games/duplicates', function (req, res) {

        // Get games list
        Game.find(function (err, games) {
            if (err)
                res.send(CODE.SERVER_ERROR);

            winston.log('Games count : ' + games.length);

            checkRecursif(0, games, function () {
                res.send(CODE.SUCCESS);
            });
        });
    });

    function checkRecursif(i, games, callback) {
        if (i < games.length) {

            var game = games[i];

            Game.find({name: game.name}, function (err, result) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                //console.log('Search : ' + game.name);

                if (result.length > 1) {
                    console.log('Duplicate with : ' + result[1].name);

                    Game.remove({
                        _id: result[1]._id
                    }, function (err) {
                        if (err)
                            console.error(err);
                        console.log('Duplicate removed !');
                    });
                }

                checkRecursif(i + 1, games, callback);
            });
        } else {
            callback();
        }
    }

    return app;
}
();