module.exports = function () {
    var express = require('express');
    var app = express();

    var Platform = require('models/platform');

    // Create a platform (accessed at POST http://localhost:8080/api/platforms)
    app.post('/platforms', function (req, res) {

        var platform = new Platform();      // create a new instance of the Platform model
        platform.name = req.body.name;  // set the platforms name (comes from the request)

        // save the platform and check for errors
        platform.save(function (err) {
            if (err)
                res.send(err.message);
            res.json({message: 'Platform created!'});
        });
    })

        // Get all the platforms (accessed at GET http://localhost:8080/api/platforms)
        .get('/platforms', function (req, res) {
            Platform.find(function (err, platforms) {
                if (err)
                    res.send(err);
                res.json(platforms);
            });
        })

        // Get the platform with that id (accessed at GET http://localhost:8080/api/platforms/:platform_id)
        .get('/platforms/:platform_id', function (req, res) {
            Platform.findById(req.params.platform_id, function (err, platform) {
                if (err)
                    res.send(err);
                res.json(platform);
            });
        })

        // Update the platform with this id (accessed at PUT http://localhost:8080/api/platforms/:platform_id)
        .put('/platforms/:platform_id', function (req, res) {
            // Use our platform model to find the platform we want
            Platform.findById(req.params.platform_id, function (err, platform) {
                if (err)
                    res.send(err);

                platform.name = req.body.name;  // update the platforms info
                platform.image = req.body.image;
                platform.updateDate = new Date();

                // Save the platform
                platform.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Platform updated!'});
                });
            });
        })

        // Delete the platform with this id (accessed at DELETE http://localhost:8080/api/platforms/:platform_id)
        .delete('/platforms/:platform_id', function (req, res) {
            Platform.remove({
                _id: req.params.platform_id
            }, function (err, platform) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });

    return app;
}();