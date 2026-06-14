const mongoose = require('mongoose');


async function connectDB() {
    await mongoose.connect('mongodb+srv://Tirth:OeTuVEhU1wH0tkFr@edemy.qn4dygr.mongodb.net/EDemy')

    console.log('Connected to DB');
}

module.exports = connectDB;
