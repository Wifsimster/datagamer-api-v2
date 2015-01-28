var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EditorSchema = new Schema({
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

var Editor = mongoose.model('Editor', EditorSchema);

//Check if exist before saving
EditorSchema.pre('save', function (next) {
    var self = this;
    Editor.find({name: self.name}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('Editor exists: ', self.name);
            var err = new Error('Editor already exists !');
            next(err);
        }
    });
});

module.exports = mongoose.model('Editor', EditorSchema);