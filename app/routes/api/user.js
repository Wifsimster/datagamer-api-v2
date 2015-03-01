module.exports = function () {
    var winston = require('winston');
    var express = require('express');
    var app = express();

    // Models
    var User = require('../../models/user');

    // Enums
    var CODE = require('../../enums/codes');

    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------

        // Description : Add a new user
        // URL: http://localhost:8080/api/users
        // Form params :
        //          - name
        //          - email
        .post('/users', function (req, res) {

            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;

            if (user.name && user.email) {
                // Save the user and check for errors
                user.save(function (err, object) {
                    if (err)
                        res.json(CODE.BAD_REQUEST);

                    CODE.SUCCESS_POST.user = object;
                    res.json(CODE.SUCCESS_POST);
                });
            } else {
                res.json(CODE.MISSING_DATA);
            }
        })

        // -----------------------------------------------------------------------------------
        // --                                       GET                                     --
        // -----------------------------------------------------------------------------------

        // Description : Get all the users, come with pagination params
        // URL : http://localhost:8080/api/users/?skip=:skip&limit=:limit
        // URL params :
        //          - skip
        //          - limit
        .get('/users', function (req, res) {

            var skip = req.param('skip');
            var limit = req.param('limit');

            winston.info("-- Searching users with skip '" + skip + "' and limit '" + limit + "'...");

            User.find()
                .skip(skip)
                .limit(limit)
                .exec(function (err, users) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = users.length;
                    winston.info('-- ' + count + ' user(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.users = users;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get users by a name
        // URL : http://localhost:8080/api/users/by/name/:name
        .get('/users/by/name/:user_name', function (req, res) {
            User.find({name: req.params.user_name}, function (err, users) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                User.count({name: req.params.user_name}, function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    winston.info(count + ' user(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.users = users;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // Description : Get a user by an id
        // URL : http://localhost:8080/api/users/by/:id
        .get('/users/by/id/:user_id', function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                winston.info('Searching for user id ' + req.params.user_id + ' : ' + user.name);

                // Build the response
                CODE.SUCCESS.user = user;

                res.json(CODE.SUCCESS);
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a user with an id
        // URL : http://localhost:8080/api/users/:user_id
        // Param :
        //          - id
        // Form params :
        //          - User Object
        .put('/users/:user_id', function (req, res) {
            // Use our user model to find the user we want
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.send(err);

                user.name = req.body.name;  // update the users info
                user.email = req.body.email;

                // Save the user
                user.save(function (err) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.user = user;

                    res.json(CODE.SUCCESS_PUT);
                });
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                     DELETE                                    --
        // -----------------------------------------------------------------------------------

        // Description : Delete a user with an id
        // URL : http://localhost:8080/api/users/:user_id
        // Param :
        //          - id
        .delete('/users/:user_id', function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                res.json(CODE.SUCCESS_DELETE);
            });
        });

    return app;
}();