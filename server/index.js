require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/db.js');
const { registerUser, loginUser, updateUserProfile, changePassword, forgotPassword, resetPassword } = require('./src/controller/User.controller.js');
const { AuthMiddleware } = require('./src/middleware/authMiddleware.js');
const { isEducator } = require('./src/middleware/isEducator.js');
const { addCourse, getEducatorCourses, getAllCourses, enrolledCourses, getEducatorDashboardData, rateAndReviewCourse } = require('./src/controller/Course.controller.js');
const { getUserProgress, updateUserProgress, getAllUserProgress } = require('./src/controller/Progress.controller.js');
const { askDoubt, getLectureDoubts, replyDoubt, getEducatorDoubts } = require('./src/controller/Doubt.controller.js');
const paymentRoutes = require('./src/route/Payment.route.js');
const Course = require('./src/model/Course.model.js');
const path = require('path')
const { upload } = require('./src/middleware/multerMiddleware.js');
const cookieParser = require('cookie-parser');
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'https://e-demy-learning-management-system.vercel.app'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


connectDB();

app.post('/auth/register', registerUser);
app.post('/auth/login', loginUser);
app.post('/auth/update-profile', AuthMiddleware, updateUserProfile);
app.post('/auth/change-password', AuthMiddleware, changePassword);
app.post('/auth/forgot-password', forgotPassword);
app.post('/auth/reset-password/:token', resetPassword);


app.post('/courses/create', AuthMiddleware, isEducator, upload.single("courseThumbnail"), addCourse);

app.get('/courses/educator', AuthMiddleware, isEducator, getEducatorCourses);
app.get('/courses/enrolled', AuthMiddleware, enrolledCourses);
app.get('/courses', getAllCourses);

app.use('/api/payment', paymentRoutes);

// 1. Static route first
app.get('/courses/progress', AuthMiddleware, getAllUserProgress);

// 2. Wildcard route second
app.get('/courses/progress/:courseId', AuthMiddleware, getUserProgress);
app.post('/courses/progress/update', AuthMiddleware, updateUserProgress);

app.get('/courses/educator-dashboard', AuthMiddleware, isEducator, getEducatorDashboardData);
app.post('/courses/rate', AuthMiddleware, rateAndReviewCourse);

// Doubt Routes
app.post('/courses/doubts/create', AuthMiddleware, askDoubt);
app.get('/courses/doubts/:courseId/:lectureId', AuthMiddleware, getLectureDoubts);
app.post('/courses/doubts/reply/:doubtId', AuthMiddleware, replyDoubt);
app.get('/courses/doubts/educator', AuthMiddleware, isEducator, getEducatorDoubts);


app.get('/', (req, res) => {
    res.send("Hello World");
});



// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler Catch:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong on the server"
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
