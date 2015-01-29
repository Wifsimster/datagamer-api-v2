module.exports = function () {
    var express = require('express');
    var unirest = require('unirest');
    var app = express();

    var Game = require('../../models/game');

    // Create a game (accessed at POST http://localhost:8080/api/games)
    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------

        // Description : Add a new game
        // URL: http://localhost:8080/api/games
        // Param :
        //          - name
        .post('/games', function (req, res) {

            var game = new Game();      // create a new instance of the Game model
            game.name = req.body.name;  // set the games name (comes from the request)

            // save the game and check for errors
            game.save(function (err) {
                if (err)
                    res.send(err.message);

                console.log('Game ' + game.name + ' added !');
                res.json({message: 'Game added !', game: game});
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                       GET                                     --
        // -----------------------------------------------------------------------------------

        // Description : Get all the games
        // URL : http://localhost:8080/api/games
        .get('/games', function (req, res) {
            Game.find(function (err, games) {
                if (err)
                    res.send(err);

                Game.count({}, function (err, count) {
                    if (err)
                        res.send(err);
                    console.log(count + ' game(s) founded !');
                    res.json({message: count + ' game(s) founded !', count: count, games: games});
                })
            });
        })

        // Description : Get games by a name
        // URL : http://localhost:8080/api/games/by/name/:name
        .get('/games/by/name/:game_name', function (req, res) {
            Game.find({name: req.params.game_name}, function (err, games) {
                if (err)
                    res.send(err);

                Game.count({name: req.params.game_name}, function (err, count) {
                    if (err)
                        res.send(err);
                    console.log(count + ' game(s) founded !');
                    res.json({message: count + ' game(s) founded !', count: count, games: games});
                });
            });
        })

        // Description : Get a game by an id
        // URL : http://localhost:8080/api/games/by/:id
        .get('/games/by/id/:game_id', function (req, res) {
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(err);
                console.log('Searching for game id ' + req.params.game_id + ' : ' + game.name);
                res.json({message: 'Game founded !', game: game});
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a game with an id
        // URL : http://localhost:8080/api/games/:game_id
        // Param :
        //          - id
        // Body :
        //          - Game Object
        .put('/games/:game_id', function (req, res) {
            // Use our game model to find the game we want
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(err);

                // Update the games info
                game.name = req.body.name;
                game.overview = req.body.overview;
                game.editors = req.body.editors;
                game.developers = req.body.developers;
                game.genres = req.body.genres;
                game.platforms = req.body.platforms;
                game.releaseDate = req.body.releaseDate;
                game.updateDate = new Date();

                if (req.body.metacritic) {
                    game.metacritic.score = req.body.metacritic.score;
                    game.metacritic.url = req.body.metacritic.url;
                }

                if (req.body.media) {
                    if (req.body.media.boxArt) {
                        game.media.boxArt.front = req.body.media.boxArt.front;
                        game.media.boxArt.rear = req.body.media.boxArt.rear;
                    }
                    game.media.thumbnails = req.body.media.thumbnails;
                    game.media.logos = req.body.media.logos;
                    game.media.banners = req.body.media.banners;
                    game.media.fanArt = req.body.media.fanArt;
                    game.media.screenshots = req.body.media.screenshots;
                    game.media.trailers = req.body.media.trailers;
                }

                // Save the game
                game.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Game updated !', game: game});
                });
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                     DELETE                                    --
        // -----------------------------------------------------------------------------------

        // Description : Delete a game with an id
        // URL : http://localhost:8080/api/games/:game_id
        // Param :
        //          - id
        .delete('/games/:game_id', function (req, res) {
            Game.remove({
                _id: req.params.game_id
            }, function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Game successfully deleted !'});
            });
        });

    return app;
}();