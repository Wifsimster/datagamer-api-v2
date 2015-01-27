var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeveloperSchema = new Schema({
    name: String,
    image: String,
    creationDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('Developer', DeveloperSchema);