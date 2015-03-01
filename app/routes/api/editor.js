module.exports = function () {
    var winston = require('winston');
    var express = require('express');
    var app = express();

    // Models
    var Editor = require('../../models/editor');

    // Enums
    var CODE = require('../../enums/codes');

    app
        // -----------------------------------------------------------------------------------
        // --                                       POST                                    --
        // -----------------------------------------------------------------------------------   

        // Description : Add a new editor
        // URL: http://localhost:8080/api/editors
        // Form params :
        //          - name
        .post('/editors', function (req, res) {
            var name = req.body.name;

            // Check if a editor already exist with this name
            Editor.findOneQ({name: name})
                .then(function (result) {
                    if (result) {
                        winston.info("Find a editor with this name : " + name);
                        res.json(CODE.ALREADY_EXIST);
                    } else {
                        // Create a new instance of the Editor model
                        var editor = new Editor();
                        editor.name = name;

                        // Save the editor and check for errors
                        editor.saveQ()
                            .then(function (editor) {
                                // Build response message
                                CODE.SUCCESS_POST.editor = editor;
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

        // Description : Get all the editors, come with pagination params
        // URL : http://localhost:8080/api/editors/?skip=:skip&limit=:limit
        // URL params :
        //          - skip
        //          - limit
        .get('/editors', function (req, res) {

            var skip = req.param('skip');
            var limit = req.param('limit');

            winston.info("-- Searching editors with skip '" + skip + "' and limit '" + limit + "'...");

            Editor.find()
                .skip(skip)
                .limit(limit)
                .exec(function (err, editors) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    var count = editors.length;
                    winston.info('-- ' + count + ' editor(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.skip = skip;
                    CODE.SUCCESS.limit = limit;
                    CODE.SUCCESS.editors = editors;

                    res.json(CODE.SUCCESS);
                });
        })

        // Description : Get editors by a name
        // URL : http://localhost:8080/api/editors/by/name/:name
        .get('/editors/by/name/:editor_name', function (req, res) {
            Editor.find({name: req.params.editor_name}, function (err, editors) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                Editor.count({name: req.params.editor_name}, function (err, count) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    winston.info(count + ' editor(s) founded !');

                    // Build the response
                    CODE.SUCCESS.count = count;
                    CODE.SUCCESS.editors = editors;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // Description : Get a editor by an id
        // URL : http://localhost:8080/api/editors/by/:id
        .get('/editors/by/id/:editor_id', function (req, res) {
            Editor.findById(req.params.editor_id, function (err, editor) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                winston.info('Searching for editor id ' + req.params.editor_id + ' : ' + editor.name);

                // Build the response
                CODE.SUCCESS.editor = editor;

                res.json(CODE.SUCCESS);
            });
        })


        // -----------------------------------------------------------------------------------
        // --                                       PUT                                     --
        // -----------------------------------------------------------------------------------

        // Description : Update a editor with an id
        // URL : http://localhost:8080/api/editors/:editor_id
        // Param :
        //          - id
        // Form params :
        //          - Editor Object
        .put('/editors/:editor_id', function (req, res) {
            // Use our editor model to find the editor we want
            Editor.findById(req.params.editor_id, function (err, editor) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                editor.name = req.body.name;  // update the editors info
                editor.image = req.body.image;
                editor.updateDate = new Date();

                // Save the editor
                editor.save(function (err) {
                    if (err)
                        res.send(CODE.SERVER_ERROR);

                    // Build the response
                    CODE.SUCCESS_PUT.editor = editor;

                    res.json(CODE.SUCCESS);
                });
            });
        })

        // -----------------------------------------------------------------------------------
        // --                                     DELETE                                    --
        // -----------------------------------------------------------------------------------

        // Description : Delete a editor with an id
        // URL : http://localhost:8080/api/editors/:editor_id
        // Param :
        //          - id
        .delete('/editors/:editor_id', function (req, res) {
            Editor.remove({
                _id: req.params.editor_id
            }, function (err, editor) {
                if (err)
                    res.send(CODE.SERVER_ERROR);

                res.json(CODE.SUCCESS_DELETE);
            });
        });

    return app;
}();