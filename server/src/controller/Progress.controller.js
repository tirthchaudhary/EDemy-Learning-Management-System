const CourseProgress = require('../model/CourseProgress.model.js');

// 1. Get student progress for a course
const getUserProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id; // From AuthMiddleware

        const progress = await CourseProgress.findOne({ userId, courseId });

        // If no progress document exists, return an empty array
        if (!progress) {
            return res.status(200).json({
                success: true,
                completedLectures: []
            });
        }

        // Send progress if found
        res.status(200).json({
            success: true,
            completedLectures: progress.completedLectures
        });
    } catch (error) {
        console.error("Error in getUserProgress:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
};

// 2. Update a completed lecture
const updateUserProgress = async (req, res) => {
    try {
        const { courseId, lectureId, completed } = req.body;
        const userId = req.user.id; // From AuthMiddleware

        const updateQuery = completed
            ? { $addToSet: { completedLectures: lectureId } }
            : { $pull: { completedLectures: lectureId } };

        const progress = await CourseProgress.findOneAndUpdate(
            { userId, courseId },
            updateQuery,
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            completedLectures: progress.completedLectures
        });
    } catch (error) {
        console.error("Error in updateUserProgress:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
};

// 3. Get all progress documents for the current user
const getAllUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progress = await CourseProgress.find({ userId });
        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        console.error("Error in getAllUserProgress:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
};


module.exports = {
    getUserProgress,
    updateUserProgress,
    getAllUserProgress
};