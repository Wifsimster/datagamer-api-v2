var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var request = require('request');
var winston = require('winston');

mongoose.connect('mongodb://192.168.0.21:27017/datagamer'); // connect to our database
//mongoose.connect('mongodb://localhost:27017/datagamer'); // connect to our database

// CORS request
app.use(cors());

// Configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set our port
var port = process.env.PORT || 8084;

// Models
var User = require('./app/models/user');

// Enums
var CODE = require('./app/enums/codes');

// Config logger file
winston.add(winston.transports.File, {filename: 'datagamer-api-v2.log'});

// Middleware to use for all requests
app.use(function (req, res, next) {

    // Don't check API key for this route
    if (req.url == "/api/users" && req.method == "POST") {
        winston.info("Don't check API key for adding new user !");
        next();
    } else {
        winston.info('-- API request : ' + req.headers.apikey);

        // Check if the API key exist
        User.findByApiKey(req.headers.apikey, function (err, users) {
            if (!err) {
                if (users.length > 0) {
                    next(); // make sure we go to the next routes and don't stop here
                } else {
                    winston.info(CODE.FORBIDDEN);
                    res.json(CODE.FORBIDDEN);
                }
            } else {
                winston.error(CODE.FORBIDDEN);
                res.json(CODE.SERVER_ERROR);
            }
        });
    }
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

// START THE SERVER
// =============================================================================
app.listen(port);
winston.info('Datagamer-api v2 is running on port ' + port);