const mongoose = require('mongoose');
const chapterSchema = require('./Chapter.model');

const CourseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    courseDescription: {
        type: String,
        required: true
    },
    coursePrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    courseContent: [chapterSchema],

    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledStudent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    courseThumbnail: {
        type: String,
        required: true
    },

    courseRatings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                default: ''
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],


}, { timestamps: true })

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;