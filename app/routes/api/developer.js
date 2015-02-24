module.exports = function () {
    var winston = require('winston');
    var express = require('express');
    var app = express();

    // Models
    var Developer = require('../../models/developer');

    // Enums
    var CODE = require('../../enums/codes');

    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------

        // Description : Add a new developer
        // URL: http://localhost:8080/api/developers
        // Form params :
        //          - name
        .post('/developers', function (req, res) {
            var name = req.body.name;

            // Check if a developer already exist with this name
            Developer.findOneQ({name: name})
                .then(function (result) {
                    if (result) {
                        winston.info("Find a developer with this name : " + name);
                        res.json(CODE.ALREADY_EXIST);
                    } else {
                        // Create a new instance of the Developer model
                        var developer = new Developer();
                        developer.name = name;

                        // Save the developer and check for errors
                        developer.saveQ()
                            .then(function (developer) {
                                // Build response message
                                CODE.SUCCESS_POST.developer = developer;
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

        // Description : Get all the developers, come with pagination params
        // URL : http://localhost:8080/api/developers/?skip=:skip&limit=:limit
        // URL params :
        //          - skip
        //          - limit
        .get('/developers', function (req, res) {

            var skip = req.param('skip');
            var limit = req.param('limit');

            winston.info("-- Searching developers with skip '" + skip + "' and limit '" + limit + "'...");

            Developer.find()
                .skip(skip)
                .limit(limit)
                .exec(function (err, developers) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = developers.length;
                    winston.info('-- ' + count + ' developer(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.games = games;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get developers by a name
        // URL : http://localhost:8080/api/developers/by/name/:name
        .get('/developers/by/name/:developer_name', function (req, res) {
            Developer.find({name: req.params.developer_name}, function (err, developers) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                Developer.count({name: req.params.developer_name}, function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    winston.info(count + ' developer(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.developers = developers;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // Description : Get a developer by an id
        // URL : http://localhost:8080/api/games/by/:id
        .get('/developers/by/id/:developer_id', function (req, res) {
            Developer.findById(req.params.developer_id, function (err, developer) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                winston.info('Searching for developer id ' + req.params.developer_id + ' : ' + developer.name);

                // Build the response
                CODE.SUCCESS.developer = developer;

                res.json(CODE.SUCCESS);
            });
        })


        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a developer with an id
        // URL : http://localhost:8080/api/developers/:developer_id
        // Param :
        //          - id
        // Form params :
        //          - Developer Object
        .put('/developers/:developer_id', function (req, res) {
            // Use our developer model to find the developer we want
            Developer.findById(req.params.developer_id, function (err, developer) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                developer.name = req.body.name;  // update the developers info
                developer.image = req.body.image;
                developer.updateDate = new Date();

                // Save the developer
                developer.save(function (err) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.developer = developer;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                     DELETE                                    --
        // -----------------------------------------------------------------------------------

        // Description : Delete a developer with an id
        // URL : http://localhost:8080/api/games/:game_id
        // Param :
        //          - id
        .delete('/developers/:developer_id', function (req, res) {
            Developer.remove({
                _id: req.params.developer_id
            }, function (err, developer) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                res.json(CODE.SUCCESS_DELETE);
            });
        });

    return app;
}();