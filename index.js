const express = require('express')
const mongoconnect = require('./db.js')
mongoconnect();
const cors = require("cors");
server = express();
server.use(cors());
// Example Node.js/Express code
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.use(express.json())

server.use('/auth', require('./routes/auth'))
server.use('/categories', require('./routes/category'))
server.use('/books', require('./routes/book'))
server.use('/userlibrary', require('./routes/userlibrary'))

server.get('/', (req, res) => {
    res.send("Hello World ")
})
server.listen(5000, () => {
    console.log("SERVER is Listening on http://localhost:5000")
})
