const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    // 1. payload-what you want to store
    //2. secrete key
    //3. expires in time
    return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

};

module.exports = { generateToken };