import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets2/assets.js";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import axios from "axios";
import { toast } from 'react-hot-toast';


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(localStorage.getItem('isEducator') === 'true');
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [openSections, setOpenSections] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [courseProgress, setCourseProgress] = useState([]);

    const [userData, setUserData] = useState(() => {
        const stored = localStorage.getItem('user');
        try {
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    });



    // Fetch All courses
    const fetchAllCourses = async (req, res) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses`);
            if (response.data.success) {
                setAllCourses(response.data.courses);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllUserProgress = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setCourseProgress(response.data.progress);
            }
        } catch (error) {
            console.log("Error fetching user progress:", error);
        }
    };


    const toggleLectureProgress = async (courseId, lectureId, completed) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/progress/update`,
                { courseId, lectureId, completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCourseProgress(prev => {
                    const exists = prev.some(p => p.courseId === courseId);
                    if (exists) {
                        return prev.map(p =>
                            p.courseId === courseId ? { ...p, completedLectures: response.data.completedLectures } : p
                        );
                    } else {
                        return [...prev, { courseId, completedLectures: response.data.completedLectures }];
                    }
                });
            }
        } catch (error) {
            console.log("Error updating lecture progress:", error);
        }
    };


    // function to calculate avg rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })

        return totalRating / course.courseRatings.length;
    }

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.forEach((lecture) => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    // function to calculate corse Duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach(chapter =>
            chapter.chapterContent.forEach(lecture =>
                time += lecture.lectureDuration
            )
        );
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }
    // function to calculate to no of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        })
        return totalLectures;
    }

    // fetch user Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setEnrolledCourses([]);
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/enrolled`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setEnrolledCourses(response.data.courses);
            }
        } catch (error) {
            console.log("Error fetching enrolled courses:", error);
            setEnrolledCourses([]);
        }
    }

    useEffect(() => {
        fetchAllCourses();
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserEnrolledCourses();
            fetchAllUserProgress();
        } else {
            setEnrolledCourses([]);
        }
    }, [isLoggedIn])

    const rateCourse = async (courseId, rating, comment) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No authentication token found");
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/rate`, { courseId, rating, comment }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.success) {
                setAllCourses(prev =>
                    prev.map(c => c._id.toString() === courseId.toString() ? { ...c, courseRatings: response.data.courseRatings } : c)
                );
                setEnrolledCourses(prev =>
                    prev.map(c => c._id.toString() === courseId.toString() ? { ...c, courseRatings: response.data.courseRatings } : c)
                );
                toast.success("Course rated successfully!");
            } else {
                toast.error(response.data.message || "Failed to rate course");
                throw new Error(response.data.message || "Failed to rate course");
            }

        } catch (error) {
            console.log("Error rating course:", error);
            throw error;
        }
    }

    const value = {
        isLoggedIn, setIsLoggedIn, currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses
        , courseProgress, fetchAllUserProgress, toggleLectureProgress, userData, setUserData, rateCourse
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
