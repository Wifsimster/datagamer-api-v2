var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required',
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    apiKey: {
        type: String,
        default: uuid.v4()
    }
});

UserSchema.statics.findByApiKey = function (apiKey, cb) {
    this.find({apiKey: apiKey}, cb);
}

module.exports = mongoose.model('User', UserSchema);