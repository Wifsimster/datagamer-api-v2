var mongoose = require('mongoose-q')(require('mongoose'));
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
}, {strict: true});

module.exports = mongoose.model('Platform', PlatformSchema);