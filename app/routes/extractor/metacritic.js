module.exports = function () {
    var express = require('express');
    var unirest = require('unirest');
    var app = express();

    // Models
    var Game = require('../../models/game');
    var Genre = require('../../models/genre');
    var Platform = require('../../models/platform');
    var Editor = require('../../models/editor');
    var Developer = require('../../models/developer');

    // Enums
    var CODE = require('../../enums/codes');

    var MASHAP_KEY = "ecmcKi5btCmshMQ2zEAagzqj9kX6p1iNBZEjsna7t1mwW51poH";
    var ACCEPT_JSON = "application/json";

    // Automatically add new games from Metacritic
    // Type : {coming-soon, new-releases}
    // Platform : {ps4, xboxone, ps3, xbox360, pc, wii-u, 3ds, vita, ios}
    // ie : http://localhost:8080/extractor/metacritic/game-list/new-releases
    app.get('/metacritic/game-list/:type', function (req, res) {

        console.log("-- Searching for games on Metacritic...");

        var type = req.params.type;

        //var platform = req.params.platform;
        var platform = "pc" // Force the platform to pc for this app

        unirest.get("https://byroredux-metacritic.p.mashape.com/game-list/pc/" + type)
            .header("X-Mashape-Key", MASHAP_KEY)
            .header("Accept", ACCEPT_JSON)
            .end(function (result) {

                if (result.body.results) {
                    var games = result.body.results;

                    asyncLoop(0, games, function () {
                        res.json(CODE.SUCCESS_POST);
                    });
                }
                else {
                    console.log("-- No result ! Maybe an error ?");
                    res.json(CODE.SERVER_ERROR);
                }
            }
        )
        ;
    });

    // Recursive loop with callback to process correctly each game
    function asyncLoop(i, games, callback) {
        if (i < games.length) {
            var mcGame = games[i];
            console.log("Check game name : " + mcGame.name);

            // Check if a game already exist with this name
            Game.findOneQ({name: mcGame.name})
                .then(function (game) {
                    if (game) {
                        console.log("---- Game '" + game.name + "' already exist in db !");
                        asyncLoop(i + 1, games, callback);
                    } else {
                        console.log("---- Game '" + mcGame.name + "' is new, so add it !");

                        // Build the game object from mcGame
                        var game = new Game();
                        game.name = mcGame.name;
                        game.metacritic.url = mcGame.url;
                        game.releaseDate = mcGame.rlsdate;
                        game.overview = mcGame.summary;
                        game.platform = mcGame.platform;

                        if (mcGame.score != "tbd") {
                            game.metacritic.score = mcGame.score;
                        }

                        // Save the current game to db
                        game.saveQ()
                            .then(function (game) {
                                console.log("---- " + game.name + " added !");
                                asyncLoop(i + 1, games, callback);
                            })
                            .catch(function (err) {
                                console.error(err)
                                asyncLoop(i + 1, games, callback);
                            });
                    }
                })
                .catch(function (err) {
                    console.error(err)
                    res.send(CODE.SERVER_ERROR);
                });
        } else {
            callback();
        }
    }

    // Automatically update game information from Metacritic data
    // Platform : {3 : pc}
    // ie : http://localhost:8084/extractor/metacritic/find/Tupa
    app.get('/metacritic/find/:name', function (req, res) {

        var platform_id = 3; // Fix platform id to pc for the app
        var name = req.params.name;

        console.log("-- Searching for '" + name + "' on Metacritic...");

        unirest.post("https://byroredux-metacritic.p.mashape.com/search/game")
            .header("X-Mashape-Key", MASHAP_KEY)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", ACCEPT_JSON)
            .send({
                "max_pages": 1,
                "platform": platform_id,
                "retry": 4,
                "title": name
            })
            .end(function (result) {

                //console.log(result.body.result);

                if (result.body.count > 0) {

                    console.log("Metacritic - " + result.body.count + " games found for : " + name);

                    //console.log("Metacritic - Add first game to db...");

                    console.log("Metacritic - Trying to add '" + result.body.results[0].name + "' to db...")

                    var mcGame = result.body.results[0];

                    console.log("Metacritic - Checking if " + mcGame.name + " already exist in db...");

                    Game.findOneQ({name: mcGame.name})
                        .then(function (game) {
                            if (!game) {
                                console.log("Metacritic - No '" + mcGame.name + "' found in db !");
                                console.log("Metacritic - Start adding " + mcGame.name + "...");

                                //// Empty array
                                //game.editors.length = 0;
                                //

                                //
                                //// Empty array
                                //game.developers.length = 0;
                                //

                                // Try to found an existing genre in db
                                //Genre.findOneQ({name: mcGame.genre})
                                //    .then(function (genre) {
                                //
                                //        console.log("Metacritic - Genre...");
                                //
                                //        game.genres = [];
                                //
                                //        if (genre) {
                                //            console.log("Metacritic - Genre '" + genre.name + "' already exist in db !");
                                //            game.genres.push(genre);
                                //        } else {
                                //            var genre = new Genre();
                                //            genre.name = mcGame.genre;
                                //
                                //            console.log("Metacritic - Genre doesn't exist, so added it...");
                                //
                                //            // Add new genre in db
                                //            genre.saveQ()
                                //                .then(function (res) {
                                //                    console.log(res);
                                //                    console.log("Metacritic - Genre '" + genre.name + "' added in db !");
                                //                    game.genres.push(genre);
                                //                })
                                //                .catch(function (err) {
                                //                    if (err)
                                //                        res.send(err.message);
                                //                });
                                //        }

                                //Try to found an existing platform in db
                                Platform.findOneQ({name: mcGame.platform})
                                    .then(function (platform) {

                                        console.log("Metacritic -       Updating platform...");

                                        if (platform) {
                                            console.log("Metacritic -       Platform '" + platform.name + "' already exist in db !");
                                        } else {
                                            var platform = new Platform();
                                            platform.name = mcGame.platform;

                                            console.log("Metacritic -       Platform doesn't exist, so added it...");

                                            // Add new platform in db
                                            platform.saveQ()
                                                .then(function (res) {
                                                    console.log("Metacritic -       Platform '" + platform.name + "' added in db !");
                                                })
                                                .catch(function (err) {
                                                    if (err)
                                                        res.send(err.message);
                                                });
                                        }

                                        // Try to found an existing editor in db
                                        Editor.findOneQ({name: mcGame.publisher})
                                            .then(function (editor) {

                                                console.log("Metacritic -       Updating editor...");

                                                if (editor) {
                                                    console.log("Metacritic -       Editor '" + editor.name + "' already exist in db !");
                                                } else {
                                                    var editor = new Editor();
                                                    editor.name = mcGame.publisher;

                                                    console.log("Metacritic -       Editor doesn't exist, so added it...");

                                                    // Add new editor in db
                                                    editor.saveQ()
                                                        .then(function (res) {
                                                            console.log("Metacritic -       Editor '" + editor.name + "' added in db !");
                                                        })
                                                        .catch(function (err) {
                                                            if (err)
                                                                res.send(err.message);
                                                        });
                                                }

                                                // Try to found an existing developer in db
                                                //Developer.findOneQ({name: mcGame.developer})
                                                //    .then(function (developer) {
                                                //
                                                //        console.log("Metacritic - Updating developer...");
                                                //
                                                //        if (developer) {
                                                //            console.log("Metacritic - Developer '" + developer.name + "' already exist in db !");
                                                //            game.developers.push(developer);
                                                //        } else {
                                                //            var developer = new Developer();
                                                //            developer.name = mcGame.developer;
                                                //
                                                //            console.log("Metacritic - Developer doesn't exist, so added it...");
                                                //
                                                //            // Add new developer in db
                                                //            developer.saveQ()
                                                //                .then(function (res) {
                                                //                    console.log("Metacritic - Developer '" + developer.name + "' added in db !");
                                                //                    game.developers.push(developer);
                                                //                })
                                                //                .catch(function (err) {
                                                //                    if (err)
                                                //                        res.send(err.message);
                                                //                });
                                                //        }

                                                // Build game object before saving it
                                                var game = new Game();

                                                game.name = mcGame.name;
                                                game.releaseDate = mcGame.rlsdate;
                                                game.overview = mcGame.summary;

                                                if (!game.metacritic)
                                                    game.metacritic = {};

                                                game.metacritic.url = mcGame.url;

                                                if (mcGame.score != "tbd") {
                                                    game.metacritic.score = mcGame.score;
                                                }

                                                //if (!game.media)
                                                //    game.media = {};
                                                //
                                                // Empty array
                                                //game.media.thumbnails = [];
                                                //game.media.thumbnails.push(mcGame.thumbnail);

                                                game.platforms = [];
                                                game.platforms.push(platform);

                                                game.editors = [];
                                                game.editors.push(editor);

                                                console.log("Metacritic - Adding " + mcGame.name + " to the db...");

                                                game.saveQ()
                                                    .then(function (game) {
                                                        console.log("Metacritic - " + game.name + " added to db !");
                                                        res.json(game);
                                                    })
                                                    .catch(function (err) {
                                                        console.error(err);
                                                        res.send(err.message);
                                                    });
                                                //})
                                                //.catch(function (err) {
                                                //    console.error("Metacritic - Error : " + err);
                                                //});
                                            })
                                            .catch(function (err) {
                                                console.error("Metacritic - Error : " + err);
                                                res.send(err.message);
                                            });
                                    })
                                    .catch(function (err) {
                                        console.error("Metacritic - Error : " + err);
                                        res.send(err.message);
                                    });
                                //})
                                //.catch(function (err) {
                                //    console.error("Metacritic - Error : " + err);
                                //});
                            } else {
                                console.warn("Metacritic - '" + game.name + "' already exist in db !")
                                res.send(game);
                            }
                        })
                        .catch(function (err) {
                            console.error("Metacritic - Error : " + err);
                            res.send(err.message);
                        });
                } else {
                    console.log("Metacritic - No result ! Maybe an error ?");
                    //console.error(result);
                }
            }
        );
    });

    return app;
}
();