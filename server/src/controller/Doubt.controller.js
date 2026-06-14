const Doubt = require('../model/Doubt.model');
const Course = require('../model/Course.model');


const askDoubt = async (req, res) => {
    try {
        const { courseId, lectureId, lectureTitle, question } = req.body;

        const newDoubt = new Doubt({
            courseId,
            lectureId,
            lectureTitle,
            question,
            user: req.user.id,
        });
        await newDoubt.save();

        res.status(201).json({ success: true, message: "Doubt submitted successfully", doubt: newDoubt });
    } catch (error) {
        console.error("Error in askDoubt:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
}

const getLectureDoubts = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;

        const doubts = await Doubt.find({ courseId, lectureId }).populate('user', 'name imageUrl')
            .populate('courseId', 'courseTitle')
            .populate('replies.user', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, doubts });
    } catch (error) {
        console.error("Error in getLectureDoubts:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
};

const replyDoubt = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const { replyText } = req.body;

        const doubt = await Doubt.findById(doubtId);
        if (!doubt) {
            return res.status(404).json({ success: false, message: "Doubt not found", error: "Doubt not found" });
        }

        doubt.replies.push({
            replyText,
            user: req.user.id
        });

        doubt.isResolved = true;

        await doubt.save();

        const updatedDoubt = await Doubt.findById(doubtId)
            .populate('user', 'name imageUrl')
            .populate('courseId', 'courseTitle')
            .populate('replies.user', 'name imageUrl');


        res.status(200).json({ success: true, message: "Reply added", doubt: updatedDoubt });

    } catch (error) {
        console.error("Error in replyDoubt:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
}

const getEducatorDoubts = async (req, res) => {
    try {
        const educatorCourses = await Course.find({ educator: req.user.id });

        const courseIds = educatorCourses.map(course => course._id);

        const doubts = await Doubt.find({ courseId: { $in: courseIds } }).populate('user', 'name imageUrl')
            .populate('courseId', 'courseTitle')
            .populate('replies.user', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, doubts });
    } catch (error) {
        console.error("Error in getEducatorDoubts:", error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
}

module.exports = {
    askDoubt,
    getLectureDoubts,
    replyDoubt,
    getEducatorDoubts
};