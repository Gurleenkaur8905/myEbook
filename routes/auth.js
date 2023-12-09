require("dotenv").config()
const express = require('express');
const router = express.Router()
const Account = require('../models/auth');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const fetchadmin = require("../middleware/fetchadmin");

// Rotue1 : Create a user using : POST "/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('username', 'Enter valid username').isLength({ min: 3 }),
    body('email', "Enter valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    //if error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const { username, email, password, is_admin } = req.body;

        const existingUsername = await Account.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "Sorry, this username already exists" });
        }

        const existingEmail = await Account.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Sorry, this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await Account.create({ username, email, password: hashedPassword, is_admin });

        const jwtKey = is_admin ? "merncourseadmin" : "merncourse";
        // console.log(jwtKey)
        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, jwtKey);
        // console.log(authtoken)
        res.status(200).json({ success: true, authtoken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occurred" });
    }

});

// Rotue 2 : Authenticate a user using: POST "/auth/login" . No login require

router.post('/login', [
    body('email', "Enter valid email").isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        let user = await Account.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const jwtKey = user.is_admin ? "merncourseadmin" : "merncourse";
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, jwtKey);
        success = true;
        res.json({ success, authtoken, admin: user.is_admin });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});


// Route 3 : Getlogged in user details using id : get  "/auth/getuser. "
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        // console.log(userId)
        const user = await Account.findById(userId);
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }

})

// Route 4 : Update the user information using: PATCH  "/auth /updateuser. "
router.patch('/updateuser', [
    body('username', 'Enter valid username').isLength({ min: 3 })
], fetchuser, async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username } = req.body;
        const userId = req.user.id;
        const user = await Account.findByIdAndUpdate(userId, { username }, { new: true });
        success = true;;
        res.status(200).json({ success, user });
        console.log(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }

})

//Route5: update Passowrd in user details using : patch "/auth/updatepassword"


router.patch('/updatepassword', [
    body('oldpassword', 'Enter your current password').notEmpty(),
    body('newpassword', 'Enter a new password with minimum 5 characters').isLength({ min: 5 }),
], fetchuser, async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oldpassword, newpassword } = req.body;
        const userId = req.user.id;

        // Fetch the user from the database
        const user = await Account.findById(userId);
        console.log(user.password)
        console.log(oldpassword)
        // Check if the provided old password matches the user's current password
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ success, errors: [{ msg: 'Invalid current password' }] });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();
        success = true;
        res.json({ success, msg: 'Password updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


// Route 6 : Getlogged in user details using  : POST  "/auth/getadmin. "
router.post('/getadmin', fetchadmin, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await Account.findById(userId);
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }

})
// Route5: Get all users from the database
router.get('/getallusers', async (req, res) => {
    try {
        const users = await Account.find({}, { password: 0 }); // Excluding password from the response

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occurred" });
    }
});

module.exports = router;

