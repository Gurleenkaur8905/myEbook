const express = require('express')
const cors = require('cors')
const mongoconnect = require('./db.js')
mongoconnect();
server = express()

server.use(express.json())
server.use(cors())

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
