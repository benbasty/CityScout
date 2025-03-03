const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Unique index. If you specify `unique: true`
    }
});
UserSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose to UserSchema
module.exports = mongoose.model('User', UserSchema);