const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDataDb = mongoose.connection.useDb(process.env.SECONDARY_DB, { useCache: true });

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    role: {
        type: String,
        enum : ['user', 'editor', 'admin'],
        default: 'user',
        required: true
    },
    password: {type: String, required: true},
    refreshToken: String
}, { strict: "throw" });

module.exports = userDataDb.model('User', userSchema);