const mongoose = require('mongoose');
const lectureSchema = require('./Lecture.model');

const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema]
}, { _id: false });

module.exports = chapterSchema;