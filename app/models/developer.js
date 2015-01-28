var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;

var DeveloperSchema = new Schema({
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

var Developer = mongoose.model('Developer', DeveloperSchema);

//Check if exist before saving
DeveloperSchema.pre('save', function (next) {
    var self = this;
    Developer.find({name: self.name}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('Developer exists: ', self.name);
            var err = new Error('Developer already exists !');
            next(err);
        }
    });
});

module.exports = mongoose.model('Developer', DeveloperSchema);