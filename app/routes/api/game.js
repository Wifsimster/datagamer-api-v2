module.exports = function () {
    var express = require('express');
    var request = require('request');
    var winston = require('winston');
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
        //          - defaultTitle
        //          - overview
        //          - editors[]
        //          - developers[]
        //          - genres[]
        //          - platforms[]
        //          - releaseDate
        //          - metacritic{}
        //          - media{}
        .post('/games', function (req, res) {
            var defaultTitle = req.body.defaultTitle;  // set the games defaultTitle (comes from the request)

            // Check if a game already exist with this defaultTitle
            Game.findOneQ({defaultTitle: defaultTitle})
                .then(function (result) {
                    if (result) {
                        winston.info("Find a game with this default title : " + defaultTitle);
                        res.json(CODE.ALREADY_EXIST);
                    } else {
                        // Create a new instance of the Game model
                        var game = new Game();
                        game.defaultTitle = defaultTitle;
                        game.titles = req.body.titles;
                        game.releaseDates = req.body.releaseDates;
                        game.versions = req.body.versions;
                        game.overview = req.body.overview;
                        game.editors = req.body.editors;
                        game.developers = req.body.developers;
                        game.genres = req.body.genres;
                        game.platforms = req.body.platforms;

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
                            game.media.fanArts = req.body.media.fanArts;
                            game.media.screenshots = req.body.media.screenshots;
                            game.media.trailers = req.body.media.trailers;
                        }

                        // Save the game and check for errors
                        game.saveQ()
                            .then(function (game) {
                                winston.info('Game ' + game.defaultTitle + ' added !');

                                // Save game object to the response object
                                CODE.SUCCESS_POST.game = game;
                                res.json(CODE.SUCCESS_POST);
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

            winston.info("-- Searching games with skip '" + skip + "' and limit '" + limit + "'...");

            Game.find()
                .skip(skip)
                .limit(limit)
                .populate('genres', 'name -_id')
                .populate('platforms', 'name -_id')
                .populate('developers', 'name -_id')
                .populate('editors', 'name -_id')
                .exec(function (err, games) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = games.length;
                    winston.info('-- ' + count + ' game(s) found !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.games = games;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get count of total games in db
        // URL : http://localhost:8080/api/games/count
        .get('/games/count', function (req, res) {

            winston.info("-- Return video games count...");

            Game.count()
                .exec(function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    winston.info('-- ' + count + ' game(s) found !');

                    // Build the response
                    CODE.SUCCESS.count = count;

                    res.json(CODE.SUCCESS);
                });
        })

        // Descripton : Get games that are similar
        // URL : http://localhost:8080/api/games/similar/by/20/for/The Forest
        .get('/games/similar/by/:percentage/for/:defaultTitle', function (req, res) {

            var percentage = req.param('percentage');
            var defaultTitle = req.param('defaultTitle');

            // Get all games
            Game.find()
                .populate('genres', 'name -_id')
                .populate('platforms', 'name -_id')
                .populate('developers', 'name -_id')
                .populate('editors', 'name -_id')
                .exec(function (err, games) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var return_games = [];

                    for (var i = 0; i < games.length; i++) {

                        var game = games[i];
                        game.percentage = 0;

                        var prct = similar_text(game.defaultTitle, defaultTitle);

                        if (prct > percentage) {
                            winston.info('Game - ' + game.defaultTitle + ' = ' + defaultTitle + ' (' + prct + ')');
                            game.percentage = prct;
                            return_games.push(game);
                        }
                    }

                    CODE.SUCCESS.games = return_games;
                    res.send(CODE.SUCCESS);
                });
        })

        // Description : Get games by a defaultTitle
        // URL : http://localhost:8080/api/games/by/defaultTitle/:defaultTitle
        .get('/games/by/defaultTitle/:defaultTitle', function (req, res) {

            var query = {defaultTitle: new RegExp(req.params.defaultTitle, "i")};

            Game.find(query)
                .populate('genres', 'name -_id')
                .populate('platforms', 'name -_id')
                .populate('developers', 'name -_id')
                .populate('editors', 'name -_id')
                .exec(function (err, games) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    Game.count(query, function (err, count) {
                        if (err)
                            res.send(CODE.SERVER_ERROR);

                        winston.info('Game - ' + count + ' game(s) found by defaultTitle : ' + req.params.defaultTitle);

                        if (count < 1) {
                            // If no game found, search on Metacritic.
                            // Metacritic method will automatically update the database if the game is found.
                            request('http://localhost:8084/utils/metacritic/search/' + req.params.defaultTitle, {
                                headers: {
                                    "apiKey": req.headers.apikey
                                }
                            }, function (error, response, body) {
                                if (!error && body) {

                                    winston.info('Game - Metacritic found a game and add it to db !');

                                    // Build the response
                                    CODE.SUCCESS.count = count;
                                    CODE.SUCCESS.games = games;

                                    res.json(CODE.SUCCESS);
                                } else {
                                    console.error("Game - Can't found the game on Metacritic !")
                                    res.json(CODE.NOT_FOUND);
                                }
                            });
                        } else {

                            // Add percentage to all return games
                            for (var i = 0; i < games.length; i++) {
                                var game = games[i];
                                game.percentage = similar_text(game.defaultTitle, req.params.defaultTitle);
                            }

                            // Build the response
                            CODE.SUCCESS.count = count;
                            CODE.SUCCESS.games = games;

                            res.json(CODE.SUCCESS);
                        }
                    });
                });
        })

        // Description : Get a game by an id
        // URL : http://localhost:8080/api/games/by/:id
        .get('/games/by/id/:game_id', function (req, res) {
            Game.findById(req.params.game_id, function (err, game) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                if (game) {
                    //winston.info(game);
                    winston.info('Searching for game id ' + req.params.game_id + ' : ' + game.defaultTitle);

                    // Metacritic method will automatically update the database if the game is found.
                    request('http://localhost:8084/utils/metacritic/find/' + game.defaultTitle, {
                        headers: {
                            "apiKey": req.headers.apikey
                        }
                    }, function (error, response, body) {
                        if (!error && body) {

                            result = JSON.parse(body);

                            if (result.code == 202) {
                                winston.info('Game - Metacritic update the game !');

                                Game.findById(req.params.game_id)
                                    .populate('genres', 'name -_id')
                                    .populate('platforms', 'name -_id')
                                    .populate('developers', 'name -_id')
                                    .populate('editors', 'name -_id')
                                    .exec(function (err, game) {
                                        if (err)
                                            res.send(CODE.SERVER_ERROR);

                                        if (game) {
                                            // Build the response
                                            CODE.SUCCESS.game = game;
                                            res.json(CODE.SUCCESS);
                                        }
                                    });
                            } else {
                                res.json(result);
                            }
                        } else {
                            console.error("Game - Can't found the game on Metacritic !")
                            res.json(CODE.NOT_FOUND);
                        }
                    });
                } else {
                    res.json(CODE.NOT_FOUND);
                }
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
                game.defaultTitle = defaultTitle;
                game.titles = req.body.titles;
                game.releaseDates = req.body.releaseDates;
                game.versions = req.body.versions;
                game.overview = req.body.overview;
                game.editors = req.body.editors;
                game.developers = req.body.developers;
                game.genres = req.body.genres;
                game.platforms = req.body.platforms;
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
                    game.media.fanArts = req.body.media.fanArts;
                    game.media.screenshots = req.body.media.screenshots;
                    game.media.trailers = req.body.media.trailers;
                }

                // Save the game
                game.save(function (err) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.game = game;

                    res.json(CODE.SUCCESS_PUT);
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

// Awesome method found here: http://stackoverflow.com/a/10473840/1283595
function similar_text(first, second) {
    // Calculates the similarity between two strings
    // discuss at: http://phpjs.org/functions/similar_text

    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }

    first += '';
    second += '';

    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;

    max = 0;

    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
                 (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }

    sum = max;

    if (sum) {
        if (pos1 && pos2) {
            sum += similar_text(first.substr(0, pos2), second.substr(0, pos2));
        }

        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
        }
    }

    return sum;
}