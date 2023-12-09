require("dotenv").config()
const express = require('express');
const router = express.Router()
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');
const fetchcategory = require("../middleware/fetchcategory");
var fetchadmin = require('../middleware/fetchadmin')

// Rotue1 :Add Category : POST "/categories/". Admin Login Require
router.post('/', [
    body('name', "Enter valid name").isLength({ min: 5 }),
    body('category_image', 'Enter a valid category image URL').isURL(),
], fetchadmin, async (req, res) => {
    let success = false;
    //if error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //Exracting Username,Email and Password From REQUEST BODY
        let { name, category_image } = req.body;
        //check whether the user with this username exists already
        let exist_name = await Category.findOne({ name });
        if (exist_name) {
            return res.status(400).json({ success, error: "Sorry this Category already exists" })
        }
        //Creating user in database
        const category = await Category.create({ name, category_image })
        success = true;
        res.status(200).json({ success, category });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});

// Rotue2 : Get Category : GET "/categories/". Admin Login Require
router.get('/', async (req, res) => {

    try {

        const category = await Category.find()
        res.status(200).json({ category });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});

// Rotue 3 :Update Category : patch "/categories/". Admin Login Require

router.patch('/', [
    body('newname', "Enter a valid name").isLength({ min: 5 }),
    body('category_image', "Enter a valid URL").isURL(),
], fetchcategory, fetchadmin, async (req, res) => {
    // Rest of the code remains the same
    // ...

    try {
        let success = false;
        // Extracting category name and URL from REQUEST BODY
        const { oldname, newname, category_image } = req.body;
        if (oldname != newname) {
            const exist_name = await Category.findOne({ name: newname });
            if (exist_name) {
                return res.status(400).json({ success, error: "Sorry, this Category name already exists" });
            }
        }
        // Check whether the category name or URL exists or not

        let exist_url = await Category.findOne({ url: category_image });

        if (exist_url) {
            return res.status(400).json({ success, error: "Sorry, this Category URL already exists" })
        }
        // Find by id and update the category name and/or URL in the database

        let updateFields = {};

        if (newname) {
            updateFields.name = newname;
        }

        if (category_image) {
            updateFields.category_image = category_image;
        }
        const category = await Category.findByIdAndUpdate(
            req.category._id,
            updateFields, // Update either name or URL or both based on what the user provided
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        success = true;
        res.status(200).json({ success, category });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occurred");
    }
});


// Rotue 4 :Delete Category : delete "/categories/". Admin Login Require
router.delete('/', fetchcategory, fetchadmin, async (req, res) => {
    let success = false;

    //if error return bad request

    try {
        const category = await Category.findByIdAndDelete(req.category._id)
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        success = true;
        res.status(200).json({ success, category });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});
//  Rotue 5 :Fetch single Category : patch "/books/name". Admin Login Require
router.get('/:name', async (req, res) => {
    try {
        let { name } = req.params;
        const category = await Category.findOne({ name: name });
        res.status(200).json({ category });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});
//  Rotue 6 :Fetch single Category by id : patch "/books/id". Admin Login Require
router.get('/id/:id', async (req, res) => {

    try {
        let { id } = req.params;
        const category = await Category.findOne({ _id: id })
        res.status(200).json({ category });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }
});

module.exports = router;