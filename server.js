// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var CronJob = require('cron').CronJob;

//mongoose.connect('mongodb://192.168.0.21:27017/datagamer'); // connect to our database
mongoose.connect('mongodb://localhost:27017/datagamer'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// Models
var User = require('./app/models/user');

// Enums
var CODE = require('./app/enums/codes');

// Middleware to use for all requests
app.use(function (req, res, next) {

    console.log('-- API request : ' + req.headers.apikey);

    // Check if the API key exist
    User.findByApiKey(req.headers.apikey, function (err, users) {
        if (!err) {
            if (users.length > 0) {
                next(); // make sure we go to the next routes and don't stop here
            } else {
                res.json(CODE.FORBIDDEN);
            }
        } else {
            res.json(CODE.SERVER_ERROR);
        }
    });
});

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/', function (req, res) {
    res.json({message: 'Hooray ! Welcome to Datagamer API !'});
});

// REGISTER OUR ROUTES -------------------------------
// API routes
app.use('/api', require('./app/routes/api/developer'));
app.use('/api', require('./app/routes/api/editor'));
app.use('/api', require('./app/routes/api/game'));
app.use('/api', require('./app/routes/api/genre'));
app.use('/api', require('./app/routes/api/platform'));
app.use('/api', require('./app/routes/api/user'));

// Extractor routes
app.use('/extractor', require('./app/routes/extractor/metacritic'));
app.use('/extractor', require('./app/routes/extractor/thegamesdb'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Datagamer is running on port ' + port);

//// Every minute execute this task
//new CronJob('01 * * * * *', function () {
//    console.log('You will see this message every minute');
//
//    // Get new release at startup
//    console.log("Start getting new release from Metacritic API...");
//
//    // Get all new release at startup
//    request({
//        url: 'http://localhost:8080/extractor/metacritic/game-list/new-releases',
//        headers: {'apiKey': 'b3dae6c0-83a0-4721-9901-bf0ee7011af8'}
//    }, function (err, res, body) {
//        if (err)
//            console.error(err);
//
//        console.log("Get all new release from Metacritic !");
//        console.log(res);
//    });
//}, null, true, "America/Los_Angeles");