module.exports = function () {
    var express = require('express');
    var unirest = require('unirest');
    var app = express();

    var Game = require('../models/game');

    // Add in db new releases from Metacritic
    app.get('/metacritic/game-list/:type/:platform', function (req, res) {

        console.log("Searching for games on Metacritic...");

        var type = req.params.type;
        var platform = req.params.platform;

        console.log("Type : " + type);
        console.log("Platform : " + platform);

        unirest.get("https://byroredux-metacritic.p.mashape.com/game-list/" + platform + "/" + type)
            .header("X-Mashape-Key", "ecmcKi5btCmshMQ2zEAagzqj9kX6p1iNBZEjsna7t1mwW51poH")
            .header("Accept", "application/json")
            .end(function (result) {
                if (result.body.results) {
                    var games = result.body.results;

                    for (var i = 1; i < games.length; i++) {
                        var mcGame = games[i];
                        var game = new Game();

                        game.name = mcGame.name;

                        if (mcGame.score != "tbd") {
                            game.metacritic.score = mcGame.score;
                        }

                        game.metacritic.url = mcGame.url;
                        game.releaseDate = mcGame.rlsdate;
                        game.overview = mcGame.summary;
                        game.platform = mcGame.platform;

                        game.save(function (err) {
                            if (err)
                                res.send(err.message);

                            res.json({message: 'Game created!'});
                        });
                    }
                } else {
                    console.log("No result ! Maybe an error ?");
                }
            });
    });

    return app;
}();