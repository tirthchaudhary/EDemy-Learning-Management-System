const mongoose = require("mongoose");

const CourseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedLectures: [
        {
            type: String,
        }
    ]
}, { timestamps: true })

const CourseProgress = mongoose.model("CourseProgress", CourseProgressSchema)
module.exports = CourseProgress
