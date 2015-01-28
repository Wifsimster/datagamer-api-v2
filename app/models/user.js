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

var User = mongoose.model('User', UserSchema);

//Check if exist before saving
UserSchema.pre('save', function (next) {
    var self = this;
    User.find({email: self.email}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('User exists: ', self.name);
            var err = new Error('User already exists !');
            next(err);
        }
    });
});

module.exports = mongoose.model('User', UserSchema);