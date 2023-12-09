require('dotenv').config()
var jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    //Get the user form the jwt token and add it to req object
    const token = req.header('auth-token');
    // console.log(token)
    if (!token) {
        // console.log(token);
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        // console.log("token try : ", token);
        const data = jwt.verify(token, "merncourse");

        req.user = data.user;
        // console.log(data);
        next();
    } catch (error) {
        // res.status(401).send({ error: "Please in authenticate using a valid token" });
        console.log("...")
    }

}


module.exports = fetchuser;