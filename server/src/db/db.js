const mongoose = require('mongoose');

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://Tirth:OeTuVEhU1wH0tkFr@edemy.qn4dygr.mongodb.net/EDemy';
        await mongoose.connect(uri);
        console.log('Connected to DB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
}

module.exports = connectDB;
