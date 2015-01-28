var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    media: {
        boxArt: {
            front: String,
            rear: String
        },
        logos: [String],
        banners: [String],
        fanArt: [String],
        screenshots: [String],
        trailers: [String]
    },
    editors: [Schema.ObjectId],
    developers: [Schema.ObjectId],
    genres: [Schema.ObjectId],
    platforms: [Schema.ObjectId],
    overview: String,
    releaseDate: Date,
    creationDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: Date,
    metacritic: {
        score: Number,
        url: String
    },
    grades: [{
        grade: {
            type: Number,
            min: 0,
            max: 10
        },
        date: Date
    }],
    appreciations: [{
        appreciation: {
            type: Number,
            min: -1,
            max: 1
        },
        date: Date
    }]
});

var Game = mongoose.model('Game', GameSchema);

//Check if exist before saving
GameSchema.pre('save', function (next) {
    var self = this;
    Game.find({name: self.name}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('Game exists: ', self.name);
            var err = new Error('Game already exists !');
            next(err);
        }
    });
});

module.exports = mongoose.model('Game', GameSchema);