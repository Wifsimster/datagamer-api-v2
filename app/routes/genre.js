module.exports = function () {
    var express = require('express');
    var app = express();

    var Genre = require('../models/genre');

    // Create a genre (accessed at POST http://localhost:8080/api/genres)
    app.post('/genres', function (req, res) {

        var genre = new Genre();      // create a new instance of the Genre model
        genre.name = req.body.name;  // set the genres name (comes from the request)

        // save the genre and check for errors
        genre.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Genre created!'});
        });
    })

        // Get all the genres (accessed at GET http://localhost:8080/api/genres)
        .get('/genres', function (req, res) {
            Genre.find(function (err, genres) {
                if (err)
                    res.send(err);
                res.json(genres);
            });
        })

        // Get the genre with that id (accessed at GET http://localhost:8080/api/genres/:genre_id)
        .get('/genres/:genre_id', function (req, res) {
            Genre.findById(req.params.genre_id, function (err, genre) {
                if (err)
                    res.send(err);
                res.json(genre);
            });
        })

        // Update the genre with this id (accessed at PUT http://localhost:8080/api/genres/:genre_id)
        .put('/genres/:genre_id', function (req, res) {
            // Use our genre model to find the genre we want
            Genre.findById(req.params.genre_id, function (err, genre) {
                if (err)
                    res.send(err);

                genre.name = req.body.name;  // update the genres info
                genre.updateDate = new Date();

                // Save the genre
                genre.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Genre updated!'});
                });
            });
        })

        // Delete the genre with this id (accessed at DELETE http://localhost:8080/api/genres/:genre_id)
        .delete('/genres/:genre_id', function (req, res) {
            Genre.remove({
                _id: req.params.genre_id
            }, function (err, genre) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });

    return app;
}();