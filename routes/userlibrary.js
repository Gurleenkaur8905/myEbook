require("dotenv").config()
const express = require('express');
const fetchuser = require("../middleware/fetchuser");
const Book = require('../models/book');
const Account = require('../models/auth');
const router = express.Router();
const UserLibrary = require('../models/userlibrary');
const fetchadmin = require("../middleware/fetchadmin");

// Rotue1 :POST  details user id and book id : POST "/book/". Admin Login Require
router.post('/', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookId = req.body.book;

        const userlibrary = await UserLibrary.create({ user: userId, book: bookId });
        res.status(200).json({ success: true, userlibrary });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});

// Rotue2 :Get details user id and book id : GET "/book/". Admin Login Require
router.get('/', fetchadmin, async (req, res) => {
    try {
        // Find all the documents in the UserLibrary collection
        const history = await UserLibrary.find();

        // Loop through each document to fetch the associated User data and Book data
        const dataWithUserAndBookDetails = await Promise.all(history.map(async (item) => {
            const userId = item.user;
            const user = await Account.findById(userId);

            const bookId = item.book;
            const book = await Book.findById(bookId);

            return {
                _id: item._id,
                user: item.user,
                book: item.book,
                downloadedAt: item.downloadedAt,
                userDetail: {
                    username: user ? user.username : null,
                    email: user ? user.email : null,
                    // Add any other User fields you want to include
                },
                bookDetail: {
                    title: book ? book.title : null,
                    // Add any other Book fields you want to include
                }
            };
        }));

        // Return the data with User and Book details as the response
        res.status(200).json(dataWithUserAndBookDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});
//Route 3: Get detail of downloads for one user
router.get('/:userId', fetchuser, async (req, res) => {
    try {
        const userId = req.params.userId; // Access the user ID from the URL parameter

        // Find all the documents in the UserLibrary collection for the specific user
        const history = await UserLibrary.find({ user: userId });

        // Loop through each document to fetch the associated User data and Book data
        const dataWithUserAndBookDetails = await Promise.all(history.map(async (item) => {
            const user = await Account.findById(userId);

            const bookId = item.book;
            const book = await Book.findById(bookId);

            return {
                _id: item._id,
                user: item.user,
                book: item.book,
                downloadedAt: item.downloadedAt,
                userDetail: {
                    username: user ? user.username : null,
                    email: user ? user.email : null,
                    // Add any other User fields you want to include
                },
                bookDetail: {
                    title: book ? book.title : null,
                    // Add any other Book fields you want to include
                }
            };
        }));

        // Return the data with User and Book details as the response
        res.status(200).json(dataWithUserAndBookDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});



module.exports = router;