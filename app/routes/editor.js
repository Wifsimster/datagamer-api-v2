module.exports = function () {
    var express = require('express');
    var app = express();

    var Editor = require('../models/editor');

    // Create a editor (accessed at POST http://localhost:8080/api/editors)
    app.post('/editors', function (req, res) {

        var editor = new Editor();      // create a new instance of the Editor model
        editor.name = req.body.name;  // set the editors name (comes from the request)

        // save the editor and check for errors
        editor.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Editor created!'});
        });
    })

        // Get all the editors (accessed at GET http://localhost:8080/api/editors)
        .get('/editors', function (req, res) {
            Editor.find(function (err, editors) {
                if (err)
                    res.send(err);
                res.json(editors);
            });
        })

        // Get the editor with that id (accessed at GET http://localhost:8080/api/editors/:editor_id)
        .get('/editors/:editor_id', function (req, res) {
            Editor.findById(req.params.editor_id, function (err, editor) {
                if (err)
                    res.send(err);
                res.json(editor);
            });
        })

        // Update the editor with this id (accessed at PUT http://localhost:8080/api/editors/:editor_id)
        .put('/editors/:editor_id', function (req, res) {
            // Use our editor model to find the editor we want
            Editor.findById(req.params.editor_id, function (err, editor) {
                if (err)
                    res.send(err);
                editor.name = req.body.name;  // update the editors info

                // Save the editor
                editor.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Editor updated!'});
                });
            });
        })

        // Delete the editor with this id (accessed at DELETE http://localhost:8080/api/editors/:editor_id)
        .delete('/editors/:editor_id', function (req, res) {
            Editor.remove({
                _id: req.params.editor_id
            }, function (err, editor) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });

    return app;
}();