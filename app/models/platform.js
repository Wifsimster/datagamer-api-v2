var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlatformSchema = new Schema({
    name: String,
    image: String,
    creationDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('Platform', PlatformSchema);