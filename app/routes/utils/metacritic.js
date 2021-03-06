module.exports = function () {
    var winston = require('winston');
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
    // ie : http://localhost:8080/utils/metacritic/game-list/new-releases
    app.get('/metacritic/game-list/:type', function (req, res) {

        winston.info("Metacritic - Searching for games on Metacritic...");

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
                    winston.info("Metacritic - No result ! Maybe an error ?");
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
            winston.info("Metacritic - Check game name : " + mcGame.name);

            // Check if a game already exist with this name
            Game.findOneQ({name: mcGame.name})
                .then(function (game) {
                    if (game) {
                        winston.info("Metacritic ---- Game '" + game.name + "' already exist in db !");
                        asyncLoop(i + 1, games, callback);
                    } else {
                        winston.info("Metacritic ---- Game '" + mcGame.name + "' is new, so add it !");

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
                                winston.info("---- " + game.name + " added !");
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

    // Automatically update games list from Metacritic data
    // Platform : {3 : pc}
    // ie : http://localhost:8084/utils/metacritic/search/Tupa
    app.get('/metacritic/search/:name', function (req, res) {

        var platform_id = 5; // Fix platform id to pc for the app
        var name = req.params.name;

        winston.info("Metacritic - Searching for '" + name + "' on Metacritic...");

        unirest.post("https://byroredux-metacritic.p.mashape.com/search/game")
            .header("X-Mashape-Key", MASHAP_KEY)
            //.header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", ACCEPT_JSON)
            .send({
                "platform": platform_id,
                "title": name
            })
            .end(function (result) {

                //winston.info(result.body.result);

                if (result.body.count > 0) {

                    winston.info("Metacritic - " + result.body.count + " games found for : " + name);

                    //winston.info("Metacritic - Add first game to db...");

                    winston.info("Metacritic - Trying to add '" + result.body.results[0].name + "' to db...")

                    //var mcGame = result.body.results[0];

                    addGamesRecursive(0, result.body.results, function () {
                        winston.info("Metacritic - Recursive search ok");
                        res.send();
                    });

                } else {
                    winston.info("Metacritic - No result ! Maybe an error ?");
                    res.send();
                }
            }
        );
    });

    // Automatically update game information from Metacritic data
    // Platform : {3 : pc}
    // ie : http://localhost:8084/utils/metacritic/find/Tupa
    app.get('/metacritic/find/:name', function (req, res) {

        var platform_id = 3; // Fix platform id to pc for the app
        var name = req.params.name;

        winston.info("Metacritic - Searching for '" + name + "' on Metacritic...");

        unirest.post("https://byroredux-metacritic.p.mashape.com/find/game")
            .header("X-Mashape-Key", MASHAP_KEY)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", ACCEPT_JSON)
            .send({
                "platform": platform_id,
                "retry": 4,
                "title": name
            })
            .end(function (result) {

                if (result.body.result) {

                    winston.info("Metacritic - Updating game '" + result.body.result.name + "' info...");

                    var metacritic_game = result.body.result;

                    winston.info("Metacritic - Searching for '" + name + "' in db...");

                    Game.findQ({defaultTitle: name})
                        .then(function (game) {

                            // Search if genre already exist in db
                            Genre.findOneQ({name: metacritic_game.genre})
                                .then(function (genre) {
                                    if (genre) {
                                        winston.info('Genre found in db !');

                                        var genres = [];
                                        genres.push(genre._id);

                                        // Add genre id to game info
                                        Game.updateQ({name: name}, {genres: genres})
                                            .then(function () {
                                                winston.info("Metacritic -  '" + name + "' updated with genre !");
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    } else {
                                        winston.info('Genre not found in db !');
                                        var genre = new Genre();
                                        genre.name = metacritic_game.genre;
                                        genre.saveQ()
                                            .then(function (genre) {
                                                winston.info("Genre added to db !");

                                                var genres = [];
                                                genres.push(genre._id);

                                                // Add genre id to game info
                                                Game.updateQ({defaultTitle: name}, {genres: genres})
                                                    .then(function () {
                                                        winston.info("Metacritic -  '" + name + "' updated with new genre !");
                                                    })
                                                    .catch(function (err) {
                                                        console.error(err);
                                                    });
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    }
                                })
                                .catch(function (err) {
                                    console.error(err);
                                });

                            // Search if platform already exist in db
                            Platform.findOneQ({name: metacritic_game.platform})
                                .then(function (platform) {
                                    if (platform) {
                                        winston.info('Platform found in db !');

                                        var platforms = [];
                                        platforms.push(platform._id);

                                        // Add platform id to game info
                                        Game.updateQ({defaultTitle: name}, {platforms: platforms})
                                            .then(function () {
                                                winston.info("Metacritic -  '" + name + "' updated with platform !");
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    } else {
                                        winston.info('Platform not found in db !');
                                        var platform = new Platform();
                                        platform.name = metacritic_game.platform;
                                        platform.saveQ()
                                            .then(function (platform) {
                                                winston.info("Platform added to db !");

                                                var platforms = [];
                                                platforms.push(platform._id);

                                                // Add platform id to game info
                                                Game.updateQ({defaultTitle: name}, {platforms: platforms})
                                                    .then(function () {
                                                        winston.info("Metacritic -  '" + name + "' updated with new platform !");
                                                    })
                                                    .catch(function (err) {
                                                        console.error(err);
                                                    });
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    }
                                })
                                .catch(function (err) {
                                    console.error(err);
                                });

                            // Search if editor already exist in db
                            Editor.findOneQ({name: metacritic_game.publisher})
                                .then(function (editor) {
                                    if (editor) {
                                        winston.info('Editor found in db !');

                                        var editors = [];
                                        editors.push(editor._id);

                                        // Add editor id to game info
                                        Game.updateQ({defaultTitle: name}, {editors: editors})
                                            .then(function () {
                                                winston.info("Metacritic -  '" + name + "' updated with editor !");
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    } else {
                                        winston.info('Editor not found in db !');
                                        var editor = new Editor();
                                        editor.name = metacritic_game.publisher;
                                        editor.saveQ()
                                            .then(function (editor) {
                                                winston.info("Editor added to db !");

                                                var editors = [];
                                                editors.push(editor._id);

                                                // Add editor id to game info
                                                Game.updateQ({defaultTitle: name}, {editors: editors})
                                                    .then(function () {
                                                        winston.info("Metacritic -  '" + name + "' updated with new editor !");
                                                    })
                                                    .catch(function (err) {
                                                        console.error(err);
                                                    });
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    }
                                })
                                .catch(function (err) {
                                    console.error(err);
                                });

                            // Search if developer already exist in db
                            Developer.findOneQ({name: metacritic_game.developer})
                                .then(function (developer) {
                                    if (developer) {
                                        winston.info('Developer found in db !');

                                        var developers = [];
                                        developers.push(developer._id);

                                        // Add developer id to game info
                                        Game.updateQ({defaultTitle: name}, {developers: developers})
                                            .then(function () {
                                                winston.info("Metacritic -  '" + name + "' updated with developer !");
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    } else {
                                        winston.info('Developer not found in db !');
                                        var developer = new Developer();
                                        developer.name = metacritic_game.developer;
                                        developer.saveQ()
                                            .then(function (developer) {
                                                winston.info("Developer added to db !");

                                                var developers = [];
                                                developers.push(developer._id);

                                                // Add developer id to game info
                                                Game.updateQ({defaultTitle: name}, {developers: developers})
                                                    .then(function () {
                                                        winston.info("Metacritic -  '" + name + "' updated with new developer !");
                                                    })
                                                    .catch(function (err) {
                                                        console.error(err);
                                                    });
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                            });
                                    }
                                })
                                .catch(function (err) {
                                    console.error(err);
                                });

                            // Update the games info
                            game.updateDate = new Date();
                            game.overview = metacritic_game.summary;

                            game.releaseDates = [];
                            var release = {};
                            release.date = metacritic_game.rlsdate;
                            game.releaseDates.push(release);

                            game.metacritic = {};
                            game.metacritic.score = metacritic_game.score;
                            game.metacritic.url = metacritic_game.url;

                            game.media = {};
                            game.media.thumbnails = []
                            game.media.thumbnails.push(metacritic_game.thumbnail);

                            Game.updateQ({defaultTitle: name}, game)
                                .then(function () {
                                    winston.info("Metacritic -  '" + name + "' updated !");
                                    res.send(CODE.SUCCESS_PUT);
                                })
                                .catch(function (err) {
                                    console.error(CODE.NOT_MODIFIED);
                                });
                        })
                        .catch(function (err) {
                            console.error(CODE.NOT_FOUND);
                        });

                } else {
                    winston.info("Metacritic -  No result ! Maybe an error ?");
                    //console.error(result);
                }
            }
        );
    });

    // Recursive loop with callback to process correctly each game
    function addGamesRecursive(i, games, callback) {
        if (i < games.length) {

            var mcGame = games[i];

            winston.info("Metacritic - Checking if " + mcGame.name + " already exist in db...");

            Game.findOneQ({defaultTitle: mcGame.name})
                .then(function (game) {
                    if (!game) {
                        winston.info("Metacritic - No '" + mcGame.name + "' found in db !");
                        winston.info("Metacritic - Start adding " + mcGame.name + "...");

                        //Try to found an existing platform in db
                        Platform.findOneQ({name: mcGame.platform})
                            .then(function (platform) {

                                winston.info("Metacritic -       Updating platform...");

                                if (platform) {
                                    winston.info("Metacritic -       Platform '" + platform.name + "' already exist in db !");
                                } else {
                                    var platform = new Platform();
                                    platform.name = mcGame.platform;

                                    winston.info("Metacritic -       Platform doesn't exist, so added it...");

                                    // Add new platform in db
                                    platform.saveQ()
                                        .then(function (res) {
                                            winston.info("Metacritic -       Platform '" + platform.name + "' added in db !");
                                        })
                                        .catch(function (err) {
                                            if (err)
                                                res.send(err.message);
                                        });
                                }

                                // Try to found an existing editor in db
                                Editor.findOneQ({name: mcGame.publisher})
                                    .then(function (editor) {

                                        winston.info("Metacritic -       Updating editor...");

                                        if (editor) {
                                            winston.info("Metacritic -       Editor '" + editor.name + "' already exist in db !");
                                        } else {
                                            var editor = new Editor();
                                            editor.name = mcGame.publisher;

                                            winston.info("Metacritic -       Editor doesn't exist, so added it...");

                                            // Add new editor in db
                                            editor.saveQ()
                                                .then(function (res) {
                                                    winston.info("Metacritic -       Editor '" + editor.name + "' added in db !");
                                                })
                                                .catch(function (err) {
                                                    if (err)
                                                        res.send(err.message);
                                                });
                                        }

                                        // Build game object before saving it
                                        var game = new Game();

                                        game.defaultTitle = mcGame.name;

                                        game.releaseDates = [];
                                        var release = {};
                                        release.date = mcGame.rlsdate;
                                        game.releaseDates.push(release);

                                        game.overview = mcGame.summary;

                                        if (!game.metacritic)
                                            game.metacritic = {};

                                        game.metacritic.url = mcGame.url;

                                        if (mcGame.score != "tbd") {
                                            game.metacritic.score = mcGame.score;
                                        }

                                        game.platforms = [];
                                        game.platforms.push(platform);

                                        game.editors = [];
                                        game.editors.push(editor);

                                        winston.info("Metacritic - Adding " + game.defaultTitle + " to the db...");

                                        game.saveQ()
                                            .then(function (game) {
                                                winston.info("Metacritic - " + game.defaultTitle + " added to db !");
                                                addGamesRecursive(i + 1, games, callback);
                                            })
                                            .catch(function (err) {
                                                console.error(err);
                                                return err.message;
                                            });
                                    })
                                    .catch(function (err) {
                                        console.error("Metacritic - Error : " + err);
                                        return err.message;
                                    });
                            })
                            .catch(function (err) {
                                console.error("Metacritic - Error : " + err);
                                return err.message;
                            });
                    } else {
                        console.warn("Metacritic - '" + game.defaultTitle + "' already exist in db !")
                        addGamesRecursive(i + 1, games, callback);
                    }
                })
                .catch(function (err) {
                    console.error("Metacritic - Error : " + err);
                    return err.message;
                });
        } else {
            winston.info("Recursive search ended !")
            callback();
        }
    }

    return app;
}
();