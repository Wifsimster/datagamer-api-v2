module.exports = function () {
    var express = require('express');
    var app = express();

    var User = require('models/user');

    // Create a user (accessed at POST http://localhost:8080/api/users)
    app.post('/users', function (req, res) {

        var user = new User();      // create a new instance of the User model

        user.name = req.body.name;  // set the users name (comes from the request)
        user.email = req.body.email;

        // save the user and check for errors
        user.save(function (err) {
            if (err)
                res.send(err.message);
            res.json({message: 'User created!'});
        });
    })

        // Get all the users (accessed at GET http://localhost:8080/api/users)
        .get('/users', function (req, res) {
            User.find(function (err, users) {
                if (err)
                    res.send(err);
                res.json(users);
            });
        })

        // Get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
        .get('/users/:user_id', function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })

        // Update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
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
                        res.send(err);
                    res.json({message: 'User updated!'});
                });
            });
        })

        // Delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete('/users/:user_id', function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });

    return app;
}();