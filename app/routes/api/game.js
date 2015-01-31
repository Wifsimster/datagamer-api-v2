module.exports = function () {
    var express = require('express');
    var unirest = require('unirest');
    var app = express();

    // Models
    var Game = require('../../models/game');

    // Enums
    var CODE = require('../../enums/codes');

    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------

        // Description : Add a new game
        // URL: http://localhost:8080/api/games
        // Form params :
        //          - name
        //          - overview
        //          - editors[]
        //          - developers[]
        //          - genres[]
        //          - platforms[]
        //          - releaseDate
        //          - metacritic{}
        //          - media{}
        .post('/games', function (req, res) {
            var name = req.body.name;  // set the games name (comes from the request)

            // Check if a game already exist with this name
            Game.findOneQ({name: name})
                .then(function (result) {
                    if (result) {
                        console.log("Find a game with this name : " + name);
                        res.json(CODE.ALREADY_EXIST);
                    } else {
                        // Create a new instance of the Game model
                        var game = new Game();
                        game.name = name;
                        game.overview = req.body.overview;
                        game.editors = req.body.editors;
                        game.developers = req.body.developers;
                        game.genres = req.body.genres;
                        game.platforms = req.body.platforms;
                        game.releaseDate = req.body.releaseDate;

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

                        // Save the game and check for errors
                        game.saveQ()
                            .then(function (game) {
                                console.log('Game ' + game.name + ' added !');

                                // Save game object to the response object
                                CODE.SUCCESS_POST.game = game;
                                res.json(CODE.SUCCESS);
                            })
                            .catch(function (err) {
                                console.error(err);
                                res.json(CODE.SERVER_ERROR);
                            });
                    }

                })
                .catch(function (err) {
                    console.error(err);
                    res.json(CODE.SERVER_ERROR);
                });
        })

        // -----------------------------------------------------------------------------------
        // --                                       GET                                     --
        // -----------------------------------------------------------------------------------

        // Description : Get all the games, come with pagination params
        // URL : http://localhost:8080/api/games/?skip=:skip&limit=:limit
        // URL params :
        //          - skip
        //          - limit
        .get('/games', function (req, res) {

            var skip = req.param('skip');
            var limit = req.param('limit');

            console.log("-- Searching games with skip '" + skip + "' and limit '" + limit + "'...");

            Game.find()
                .skip(skip)
                .limit(limit)
                .exec(function (err, games) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = games.length;
                    console.log('-- ' + count + ' game(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.games = games;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get games by a name
        // URL : http://localhost:8080/api/games/by/name/:name
        .get('/games/by/name/:game_name', function (req, res) {
            var query = {name: new RegExp(req.params.game_name, "i")};
            Game.find(query, function (err, games) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                Game.count(query, function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    console.log(count + ' game(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.games = games;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // Description : Get a game by an id
        // URL : http://localhost:8080/api/games/by/:id
        .get('/games/by/id/:game_id', function (req, res) {
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                console.log('Searching for game id ' + req.params.game_id + ' : ' + game.name);

                // Build the response
                CODE.SUCCESS.game = game;

                res.json(CODE.SUCCESS);
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a game with an id
        // URL : http://localhost:8080/api/games/:game_id
        // Param :
        //          - id
        // Form params :
        //          - Game Object
        .put('/games/:game_id', function (req, res) {
            // Use our game model to find the game we want
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

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
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.game = game;

                    res.json(CODE.SUCCESS);
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
                    res.send(CODE.SERVER_ERROR);

                res.json(CODE.SUCCESS_DELETE);
            });
        });

    return app;
}();