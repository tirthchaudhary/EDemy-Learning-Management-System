const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            default: 0,
        },
        educator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Note = mongoose.model('Note', notesSchema);
module.exports = Note;