const Course = require("../model/Course.model");
const Transaction = require("../model/Transaction.model");

const addCourse = async (req, res) => {

    try {
        const { courseTitle, courseDescription, coursePrice, discount } = req.body;

        const educator = req.user.id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Course thumbnail is required" });
        }

        const courseThumbnail = req.file.path.replace(/\\/g, '/'); // replace backslashes with forward slashes to save in mongoDB

        const chapters = JSON.parse(req.body.chapters);


        const newCourse = await Course.create({
            courseTitle: courseTitle,
            courseDescription: courseDescription,
            coursePrice: coursePrice,
            discount: discount,
            courseThumbnail: courseThumbnail,
            courseContent: chapters,
            educator: educator
        });

        console.log("Course added successfully", newCourse);
        res.status(201).json({ success: true, message: "Course added successfully", course: newCourse });

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

}

const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.user.id;
        const courses = await Course.find({ educator: educatorId });

        res.status(200).json({
            success: true,
            courses
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate('courseRatings.user', 'name imageUrl');
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const enrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const courses = await Course.find({ enrolledStudent: userId }).populate('courseRatings.user', 'name imageUrl');
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getEducatorDashboardData = async (req, res) => {
    try {
        const educatorId = req.user.id;
        const courses = await Course.find({ educator: educatorId });
        const courseIds = courses.map(course => course._id);

        // Find all successful purchases for these courses
        const transactions = await Transaction.find({
            course: { $in: courseIds },
            status: 'success',
        }).populate('user', 'name email').populate('course', 'courseTitle');

        const totalCourses = courses.length;
        const totalEnrollments = transactions.length;
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

        const enrolledStudents = transactions.map(t => ({
            student: {
                _id: t.user ? t.user._id : 'deleted',
                name: t.user ? t.user.name : 'Unknown User',
                imageUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' // placeholder or real image url if stored
            },
            courseTitle: t.course ? t.course.courseTitle : 'Deleted Course',
            purchaseDate: t.createdAt
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalRevenue,
                totalEnrollments,
                totalCourses
            },
            enrolledStudents
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const rateAndReviewCourse = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!courseId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Invalid course ID or rating range (1-5)" });
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" })
        }

        if (!course.enrolledStudent.includes(userId)) {
            return res.status(403).json({ success: false, message: "Only enrolled students can rate or review this course" });
        }

        const existingReviewIndex = course.courseRatings.findIndex(
            r => r.user && r.user.toString() === userId
        );

        if (existingReviewIndex !== -1) {
            course.courseRatings[existingReviewIndex].rating = rating;
            course.courseRatings[existingReviewIndex].comment = comment;
            course.courseRatings[existingReviewIndex].createdAt = Date.now();
        } else {
            course.courseRatings.push({
                user: userId,
                rating: rating,
                comment: comment,
                createdAt: Date.now()
            });
        }

        await course.save();

        const updatedCourse = await Course.findById(courseId).populate('courseRatings.user', 'name imageUrl');

        res.status(200).json({
            success: true,
            message: "Review submitted successfully!",
            courseRatings: updatedCourse.courseRatings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { addCourse, getEducatorCourses, getAllCourses, enrolledCourses, getEducatorDashboardData, rateAndReviewCourse };
