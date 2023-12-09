const mongoose = require('mongoose')
const Account = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    is_admin: {
        type: Boolean,
        require: true
    },
    password: {
        type: String,
        required: true
    }
});

const account = mongoose.model('Account', Account);
module.exports = account;