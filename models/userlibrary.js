const mongoose = require('mongoose')

const userLibrarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    downloadedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const UserLibrary = mongoose.model('UserLibrary', userLibrarySchema);
module.exports = UserLibrary;
