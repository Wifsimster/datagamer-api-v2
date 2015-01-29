var mongoose = require('mongoose-q')(require('mongoose'));
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

module.exports = mongoose.model('Editor', EditorSchema);