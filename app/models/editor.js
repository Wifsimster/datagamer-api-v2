var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EditorSchema = new Schema({
    name: String,
    image: String,
    creationDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('Editor', EditorSchema);