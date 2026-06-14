const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
    // Read from cookies (if using cookie-parser) or Authorization Bearer header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
        }
        req.user = user;
        next();
    });
}

module.exports = { AuthMiddleware };