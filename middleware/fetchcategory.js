const Category = require('../models/category');

const fetchcategory = async (req, res, next) => {
    try {
        let name = req.body.oldname;
        //check whether the user with this username exists already
        let category = await Category.findOne({ name });

        //if category not found give  response
        if (!category) {
            return res.status(400).json({ success: false, category: "Category doesnot exist." })
        }
        req.category = category;
        //Creating user in database
        next()
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error occured");
    }

}


module.exports = fetchcategory;