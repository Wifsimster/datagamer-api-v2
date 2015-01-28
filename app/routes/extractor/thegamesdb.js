module.exports = function () {
    var express = require('express');
    var unirest = require('unirest');
    var app = express();

    var Game = require('models/game');

    app.get('/thegamesdb/game-list/:name', function (req, res) {

        console.log("Searching for games on TheGamesDB...");

        var name = req.params.name;

        unirest.get("http://thegamesdb.net/api/GetGamesList.php?name=" + name)
            .end(function (result) {
                console.log(result.raw_body);

                // TODO : Need to parse XML response in JSON
            });
    });

    return app;
}();