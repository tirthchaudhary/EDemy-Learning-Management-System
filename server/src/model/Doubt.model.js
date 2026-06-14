const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    replyText: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const doubtSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lectureId: {
        type: String,
        required: true // Links the question to the specific video
    },
    lectureTitle: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Student asking the question
        required: true
    },
    replies: [replySchema], // Array of replies
    isResolved: {
        type: Boolean,
        default: false // Set to true when the educator replies
    }
}, { timestamps: true });


module.exports = mongoose.model('Doubt', doubtSchema);
