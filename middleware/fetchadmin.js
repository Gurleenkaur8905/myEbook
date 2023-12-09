require('dotenv').config()
var jwt = require('jsonwebtoken');

const fetchadmin = (req, res, next) => {
    //Get the user form the jwt token and add it to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {

        const data = jwt.verify(token, "merncourseadmin");
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
        // console.log("...")
    }

}
module.exports = fetchadmin;