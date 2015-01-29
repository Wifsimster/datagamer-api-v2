var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required',
        trim: true,
        unique: true
    },
    creationDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('Genre', GenreSchema);