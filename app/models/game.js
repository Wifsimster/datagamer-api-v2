var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    defaultTitle: {type: String, trim: true, required: true},
    overview: String,
    titles: [{name: {type: String, trim: true}, countryCode: {type: String, uppercase: true, match: /[A-Z]{3}/}}],
    releaseDate: [{date: Date, countryCode: {type: String, uppercase: true, match: /[A-Z]{3}/}}],
    versions: [{number: String, date: Date, description: String}],
    metacritic: {score: Number, url: String},
    editors: [{type: Schema.Types.ObjectId, ref: 'Editor'}],
    developers: [{type: Schema.Types.ObjectId, ref: 'Developer'}],
    genres: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    platforms: [{type: Schema.Types.ObjectId, ref: 'Platform'}],
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

    // Applicative attributes
    percentage: Number,
    updatedDate: Date,
    creationDate: {type: Date, default: Date.now}
}, {strict: true});

module.exports = mongoose.model('Game', GameSchema);