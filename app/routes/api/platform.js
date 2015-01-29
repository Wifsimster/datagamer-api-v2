module.exports = function () {
    var express = require('express');
    var app = express();

    // Models
    var Platform = require('../../models/platform');

    // Enums
    var CODE = require('../../enums/codes');

    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------   

        // Description : Add a new platform
        // URL: http://localhost:8080/api/platforms
        // Form params :
        //          - name
        .post('/platforms', function (req, res) {
            var name = req.body.name;

            // Check if a platform already exist with this name
            Platform.findOneQ({name: name})
                .then(function (result) {
                    if (result) {
                        console.log("Find a platform with this name : " + name);
                        res.json(CODE.ALREADY_EXIST);
                    } else {
                        // Create a new instance of the Platform model
                        var platform = new Platform();
                        platform.name = name;

                        // Save the platform and check for errors
                        platform.saveQ()
                            .then(function (platform) {
                                // Build response message
                                CODE.SUCCESS_POST.platform = platform;
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

        // Description : Get all the platforms, come with pagination params
        // URL : http://localhost:8080/api/platforms/?skip=:skip&limit=:limit
        // URL params :
        //          - skip
        //          - limit
        .get('/platforms', function (req, res) {

            var skip = req.param('skip');
            var limit = req.param('limit');

            console.log("-- Searching platforms with skip '" + skip + "' and limit '" + limit + "'...");

            Platform.find()
                .skip(skip)
                .limit(limit)
                .exec(function (err, platforms) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = platforms.length;
                    console.log('-- ' + count + ' platform(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.games = games;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get platforms by a name
        // URL : http://localhost:8080/api/platforms/by/name/:name
        .get('/platforms/by/name/:platform_name', function (req, res) {
            Platform.find({name: req.params.platform_name}, function (err, platforms) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                Platform.count({name: req.params.platform_name}, function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    console.log(count + ' platform(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.platforms = platforms;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // Description : Get a platform by an id
        // URL : http://localhost:8080/api/games/by/:id
        .get('/platforms/by/id/:platform_id', function (req, res) {
            Platform.findById(req.params.platform_id, function (err, platform) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                console.log('Searching for platform id ' + req.params.platform_id + ' : ' + platform.name);

                // Build the response
                CODE.SUCCESS.platform = platform;

                res.json(CODE.SUCCESS);
            });
        })


        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a platform with an id
        // URL : http://localhost:8080/api/platforms/:platform_id
        // Param :
        //          - id
        // Form params :
        //          - Platform Object
        .put('/platforms/:platform_id', function (req, res) {
            // Use our platform model to find the platform we want
            Platform.findById(req.params.platform_id, function (err, platform) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                platform.name = req.body.name;  // update the platforms info
                platform.image = req.body.image;
                platform.updateDate = new Date();

                // Save the platform
                platform.save(function (err) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.platform = platform;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                     DELETE                                    --
        // -----------------------------------------------------------------------------------

        // Description : Delete a platform with an id
        // URL : http://localhost:8080/api/games/:game_id
        // Param :
        //          - id
        .delete('/platforms/:platform_id', function (req, res) {
            Platform.remove({
                _id: req.params.platform_id
            }, function (err, platform) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                res.json(CODE.SUCCESS_DELETE);
            });
        });

    return app;
}();