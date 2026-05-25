const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URL;
        if (uri && uri.includes('MONGODB_URI=')) {
            uri = uri.replace('MONGODB_URI=', '');
        }
        await mongoose.connect(uri);
        console.log('MongoDB cluster connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
};

module.exports = connectDB;
