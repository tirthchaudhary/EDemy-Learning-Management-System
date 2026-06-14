const isEducator = (req, res, next) => {

    if (req.user.role !== 'educator') {
        return res.status(403).json({ success: false, message: "Forbidden: Not an educator" });
    }
    next();
}
module.exports = { isEducator };