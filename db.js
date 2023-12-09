const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://myebooks:admin01@cluster0.6o5aavb.mongodb.net/ebooks?retryWrites=true&w=majority';
// const mongoURL = 'mongodb://127.0.0.1:27017/ebooks';
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL, connectionParams);
        console.log('Connection made successfully');
    } catch (error) {
        console.error('Connection error:', error);
    }
};

module.exports = connectToMongo;