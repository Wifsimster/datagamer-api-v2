module.exports = function () {
    var winston = require('winston');
    var express = require('express');
    var app = express();

    // Models
    var Genre = require('../../models/genre');

    // Enums
    var CODE = require('../../enums/codes');

    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------   

        // Description : Add a new genre
        // URL: http://localhost:8080/api/genres
        // Form params :
        //          - name
        .post('/genres', function (req, res) {
            var name = req.body.name;

            // Check if a genre already exist with this name
            Genre.findOneQ({name: name})
                .then(function (result) {
                    if (result) {
                        winston.info("Find a genre with this name : " + name);
                        res.json(CODE.ALREADY_EXIST);
                    } else {
                        // Create a new instance of the Genre model
                        var genre = new Genre();
                        genre.name = name;

                        // Save the genre and check for errors
                        genre.saveQ()
                            .then(function (genre) {
                                // Build response message
                                CODE.SUCCESS_POST.genre = genre;
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

        // Description : Get all the genres, come with pagination params
        // URL : http://localhost:8080/api/genres/?skip=:skip&limit=:limit
        // URL params :
        //          - skip
        //          - limit
        .get('/genres', function (req, res) {

            var skip = req.param('skip');
            var limit = req.param('limit');

            winston.info("-- Searching genres with skip '" + skip + "' and limit '" + limit + "'...");

            Genre.find()
                .skip(skip)
                .limit(limit)
                .exec(function (err, genres) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = genres.length;
                    winston.info('-- ' + count + ' genre(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.games = games;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get genres by a name
        // URL : http://localhost:8080/api/genres/by/name/:name
        .get('/genres/by/name/:genre_name', function (req, res) {
            Genre.find({name: req.params.genre_name}, function (err, genres) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                Genre.count({name: req.params.genre_name}, function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    winston.info(count + ' genre(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.genres = genres;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // Description : Get a genre by an id
        // URL : http://localhost:8080/api/games/by/:id
        .get('/genres/by/id/:genre_id', function (req, res) {
            Genre.findById(req.params.genre_id, function (err, genre) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                winston.info('Searching for genre id ' + req.params.genre_id + ' : ' + genre.name);

                // Build the response
                CODE.SUCCESS.genre = genre;

                res.json(CODE.SUCCESS);
            });
        })


        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a genre with an id
        // URL : http://localhost:8080/api/genres/:genre_id
        // Param :
        //          - id
        // Form params :
        //          - Genre Object
        .put('/genres/:genre_id', function (req, res) {
            // Use our genre model to find the genre we want
            Genre.findById(req.params.genre_id, function (err, genre) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                genre.name = req.body.name;  // update the genres info
                genre.updateDate = new Date();

                // Save the genre
                genre.save(function (err) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.genre = genre;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                     DELETE                                    --
        // -----------------------------------------------------------------------------------

        // Description : Delete a genre with an id
        // URL : http://localhost:8080/api/games/:game_id
        // Param :
        //          - id
        .delete('/genres/:genre_id', function (req, res) {
            Genre.remove({
                _id: req.params.genre_id
            }, function (err, genre) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                res.json(CODE.SUCCESS_DELETE);
            });
        });

    return app;
}();