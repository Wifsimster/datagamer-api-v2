module.exports = function () {
    var express = require('express');
    var app = express();

    var Developer = require('../../models/developer');

    // Create a developer (accessed at POST http://localhost:8080/api/developers)
    app.post('/developers', function (req, res) {

        var developer = new Developer();      // create a new instance of the Developer model
        developer.name = req.body.name;  // set the developers name (comes from the request)

        // save the developer and check for errors
        developer.save(function (err) {
            if (err)
                res.send(err.message);
            res.json({message: 'Developer created!'});
        });
    })

        // Get all the developers (accessed at GET http://localhost:8080/api/developers)
        .get('/developers', function (req, res) {
            Developer.find(function (err, developers) {
                if (err)
                    res.send(err);
                res.json(developers);
            });
        })

        // Get the developer with that id (accessed at GET http://localhost:8080/api/developers/:developer_id)
        .get('/developers/:developer_id', function (req, res) {
            Developer.findById(req.params.developer_id, function (err, developer) {
                if (err)
                    res.send(err);
                res.json(developer);
            });
        })

        // Update the developer with this id (accessed at PUT http://localhost:8080/api/developers/:developer_id)
        .put('/developers/:developer_id', function (req, res) {
            // Use our developer model to find the developer we want
            Developer.findById(req.params.developer_id, function (err, developer) {
                if (err)
                    res.send(err);

                developer.name = req.body.name;  // update the developers info
                developer.image = req.body.image;
                developer.updateDate = new Date();

                // Save the developer
                developer.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'Developer updated!'});
                });
            });
        })

        // Delete the developer with this id (accessed at DELETE http://localhost:8080/api/developers/:developer_id)
        .delete('/developers/:developer_id', function (req, res) {
            Developer.remove({
                _id: req.params.developer_id
            }, function (err, developer) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });

    return app;
}();