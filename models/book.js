const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    is_free: {
        type: Boolean,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    published: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    book_image: {
        type: String,
        required: true
    },
    book_pdf_path: {
        type: String,
        required: true
    },
    book_pdf_download: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
