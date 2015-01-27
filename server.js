// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.0.21:27017/datagamer'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var User = require('./app/models/user');

// Middleware to use for all requests
app.use(function (req, res, next) {

    console.log('Request bitch !' + req.headers.apikey);

    // Check if the API key exist
    User.findByApiKey(req.headers.apikey, function(err, users) {
        if(!err) {
            console.log(users);
            if(users.length > 0) {
                next(); // make sure we go to the next routes and don't stop here
            } else {
                res.json("This API key does not exist !");
            }
        } else {
            res.json("Error !");
        }
    });
});

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/', function (req, res) {
    res.json({message: 'Hooray ! Welcome to Datagamer API !'});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', require('./app/routes/developer'));
app.use('/api', require('./app/routes/editor'));
app.use('/api', require('./app/routes/game'));
app.use('/api', require('./app/routes/genre'));
app.use('/api', require('./app/routes/platform'));
app.use('/api', require('./app/routes/user'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Datagamer is running on port ' + port);
