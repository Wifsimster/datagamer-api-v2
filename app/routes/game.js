module.exports = function () {
    var express = require('express');
    var app = express();

    var Game = require('../models/game');

    // Create a game (accessed at POST http://localhost:8080/api/games)
    app.post('/games', function (req, res) {

        var game = new Game();      // create a new instance of the Game model
        game.name = req.body.name;  // set the games name (comes from the request)

        // save the game and check for errors
        game.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Game created!'});
        });
    })

        // Get all the games (accessed at GET http://localhost:8080/api/games)
        .get('/games', function (req, res) {
            Game.find(function (err, games) {
                if (err)
                    res.send(err);
                res.json(games);
            });
        })

        // Get the game with that id (accessed at GET http://localhost:8080/api/games/:game_id)
        .get('/games/:game_id', function (req, res) {
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(err);
                res.json(game);
            });
        })

        // Update the game with this id (accessed at PUT http://localhost:8080/api/games/:game_id)
        .put('/games/:game_id', function (req, res) {
            // Use our game model to find the game we want
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(err);
                game.name = req.body.name;  // update the games info

                // Save the game
                game.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Game updated!'});
                });
            });
        })

        // Delete the game with this id (accessed at DELETE http://localhost:8080/api/games/:game_id)
        .delete('/games/:game_id', function (req, res) {
            Game.remove({
                _id: req.params.game_id
            }, function (err, game) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });

    return app;
}();