require("dotenv").config()
const express = require('express');
const router = express.Router()
const Book = require('../models/book');
const Category = require('../models/category')
const { body, param, validationResult } = require('express-validator');
const fetchadmin = require("../middleware/fetchadmin");
const fetchcategory = require("../middleware/fetchcategory");

// Rotue1 :Add Book : POST "/book/". Admin Login Require
router.post('/', [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('author', 'Enter a valid author').isLength({ min: 3 }),
    body('price', 'Enter a valid price').isNumeric(),
    body('is_free', 'is_free should be a boolean value').isBoolean(),
    body('oldname', 'Enter a valid category Name').isString(),
    body('published', 'Enter a valid date').isLength({ min: 4 }),
    body('pages', 'Enter a valid number of pages').isNumeric(),
    body('isbn', 'Enter a valid ISBN').isLength({ min: 8, max: 13 }),
    body('book_image', 'Enter a valid book image URL').isURL(),
    body('book_pdf_path', 'Enter a valid book PDF path').isURL(),
    body('book_pdf_download', 'Enter a valid book download PDF path').isURL(),
    body('rating', 'Enter a valid rating').isNumeric(),
    body('description', 'Enter a valid description').isLength({ min: 10 }),
    body('language', 'Enter a valid language').isLength({ min: 4 }),

], fetchcategory, fetchadmin, async (req, res) => {
    let success = false;


    //if error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //Exracting Username,Email and Password From REQUEST BODY
        let { title, author, price, is_free, published, pages, isbn, book_image, book_pdf_path, book_pdf_download, rating, description, language } = req.body;
        let category = req.category._id;

        //check whether the user with this username exists already
        let exist_book_name = await Book.findOne({ title });
        if (exist_book_name) {
            return res.status(400).json({ success, error: "Sorry this Book title already exists" })
        }
        //Creating user in database
        const book = await Book.create({ title, author, price, is_free, category, published, pages, isbn, book_image, book_pdf_path, book_pdf_download, rating, description, language })
        success = true;
        res.status(200).json({ success, book });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});

// Rotue2 : Fetch all  Book : GET "/books/". Admin Login Require
router.get('/', async (req, res) => {
    try {
        let book;
        if (req.query) {
            const { category, rating, language } = req.query;
            let query = {};

            if (category) {
                const categoryString = String(category);
                const categoryNames = categoryString.split(',');
                const categories = await Category.find({ name: { $in: categoryNames } });
                const categoryIds = categories.map((category) => category._id);
                query.category = { $in: categoryIds }; // Use $in instead of $all
            }

            if (rating) {
                const ratingValues = rating.split(',').map(Number);
                query.rating = { $in: ratingValues };
            }

            if (language) {
                query.language = language;
            }

            book = await Book.find(query);
        } else {
            book = await Book.find();
        }

        res.status(200).json({ book });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});


//  Rotue 3 :Fetch single Book : get "/books/q=id". Admin Login Require
router.get('/byid', async (req, res) => {

    try {
        let id = req.query.q;
        const book = await Book.findOne({ _id: id })
        res.status(200).json({ book });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});

// Rotue 4 :Update Books : patch "/categories/". Admin Login Require

router.patch('/:id', fetchadmin, [
    param('id', 'Invalid book ID').isMongoId(),
    body('title', 'Enter a valid title').optional().isLength({ min: 3 }),
    body('author', 'Enter a valid author').optional().isLength({ min: 3 }),
    body('price', 'Enter a valid price').optional().isNumeric(),
    body('is_free', 'is_free should be a boolean value').optional().isBoolean(),
    body('pages', 'Enter a valid number of pages').optional().isNumeric(),
    body('isbn', 'Enter a valid ISBN').optional().isLength({ min: 8, max: 13 }),
    body('book_image', 'Enter a valid book image URL').optional().isURL(),
    body('book_pdf_path', 'Enter a valid book PDF path').optional().isURL(),
    body(' book_pdf_download', 'Enter a valid book PDF Download path').optional().isURL(),
    body('rating', 'Enter a valid rating').optional().isNumeric(),
    body('description', 'Enter a valid description').optional().isLength({ min: 10 }),
    body('language', 'Enter a valid language name').optional().isLength({ min: 4 }),
], async (req, res) => {
    const { id } = req.params; // Get the book ID from the URL parameter

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract the fields to be updated from the request body
    const { title, author, price, is_free, published, pages, isbn, book_image, book_pdf_path, book_pdf_download, rating, description, language } = req.body;

    // Create an empty object to store the fields to be updated
    const updateFields = {};

    // Check each field and add it to the updateFields object if it exists
    if (title) updateFields.title = title;
    if (author) updateFields.author = author;
    if (price) updateFields.price = price;
    if (is_free) updateFields.is_free = is_free;
    if (published) updateFields.published = published;
    if (pages) updateFields.pages = pages;
    if (isbn) updateFields.isbn = isbn;
    if (book_image) updateFields.book_image = book_image;
    if (book_pdf_path) updateFields.book_pdf_path = book_pdf_path;
    if (book_pdf_download) updateFields.book_pdf_download = book_pdf_download;
    if (rating) updateFields.rating = rating;
    if (description) updateFields.description = description;
    if (language) updateFields.language = language;

    try {
        // Find the book by ID and update the specified fields
        const book = await Book.findByIdAndUpdate(id, updateFields, { new: true });

        if (!book) {
            return res.status(404).json({ success, error: 'Book not found' });
        }
        success = true;
        res.status(200).json({ success, book });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occurred');
    }
});

// Rotue 5 :Delete Category : delete "/books/". Admin Login Require
router.delete('/:id', fetchadmin, async (req, res) => {
    let success = false;

    //if error return bad request
    try {
        //Exracting category id from REQUEST BODY
        let id = req.params.id;
        //Find by id and update the cateogry name user in database
        const book = await Book.findByIdAndDelete({ _id: id })
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        success = true;
        res.status(200).json({ success, book });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});

//  Rotue 6 :Fetch single Book : get "/books/name".
router.get('/:name', fetchadmin, async (req, res) => {
    try {
        const { name } = req.params;
        name.replace('%20', ' ');

        // Use a case-insensitive regular expression to find all books with a matching name
        const books = await Book.find({ title: { $regex: new RegExp(name, 'i') } });

        res.status(200).json({ books });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
});





module.exports = router;