var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    name: { type: String, trim: true },
    cover: String,
    editors: [Schema.ObjectId],
    developers: [Schema.ObjectId],
    genres: [Schema.ObjectId],
    platforms: [Schema.ObjectId],
    releaseDate: Date,
    creationDate: {type: Date, default: Date.now},
    updatedDate: Date,
    grades: [{grade: {type: Number, min: 0, max: 10}, date: Date}],
    appreciations: [{appreciation: {type: Number, min: -1, max: 1}, date: Date}]
});

module.exports = mongoose.model('Game', GameSchema);