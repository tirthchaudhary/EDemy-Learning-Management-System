const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, default: false },
    lectureOrder: { type: Number, required: true }
}, { _id: false });

module.exports = lectureSchema;