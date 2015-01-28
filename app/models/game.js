var mongoose = require('mongoose-q')(require('mongoose'));
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
        thumbnails: [String],
        logos: [String],
        banners: [String],
        fanArt: [String],
        screenshots: [String],
        trailers: [String]
    },
    editors: [{type: Schema.Types.ObjectId, ref: 'Editor'}],
    developers: [{type: Schema.Types.ObjectId, ref: 'Developer'}],
    genres: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    platforms: [{type: Schema.Types.ObjectId, ref: 'Platform'}],
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
    }
});

var Game = mongoose.model('Game', GameSchema);

//Check if exist before saving
//GameSchema.pre('save', function (next) {
//    var self = this;
//    Game.findQ({name: self.name}, function (err, docs) {
//        if (!docs.length) {
//            next();
//        } else {
//            next(new Error('Game already exists !'));
//        }
//    });
//});

module.exports = mongoose.model('Game', GameSchema);