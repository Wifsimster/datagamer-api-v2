var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: String,
    creationDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('Genre', GenreSchema);