var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlatformSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required',
        trim: true,
        unique: true
    },
    image: String,
    creationDate: Date,
    updatedDate: Date
});

var Platform = mongoose.model('Platform', PlatformSchema);

//Check if exist before saving
PlatformSchema.pre('save', function (next) {
    var self = this;
    Platform.find({name: self.name}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('Platform exists: ', self.name);
            var err = new Error('Platform already exists !');
            next(err);
        }
    });
});

module.exports = mongoose.model('Platform', PlatformSchema);