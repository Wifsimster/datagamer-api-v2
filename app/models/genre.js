var mongoose = require('mongoose');
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

var Genre = mongoose.model('Genre', GenreSchema);

//Check if exist before saving
GenreSchema.pre('save', function (next) {
    var self = this;
    Genre.find({name: self.name}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('Genre exists: ', self.name);
            var err = new Error('Genre already exists !');
            next(err);
        }
    });
});

module.exports = mongoose.model('Genre', GenreSchema);