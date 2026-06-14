import { useContext, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import { AppContext } from './context/AppContext.jsx'
import Auth from './pages/Auth.jsx'
import Home from './pages/Home.jsx'
import CourseList from './pages/CourseList.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AboutPage from './pages/About.jsx'
import AllCourses from './pages/AllCourses.jsx'
import MyEnrollments from './pages/MyEnrollments.jsx'
import Player from './pages/Player.jsx'
import Educator from './pages/Educator/Educator.jsx'
import Dashboard from './pages/Educator/Dashboard.jsx'
import AddCourse from './pages/Educator/AddCourse.jsx'
import MyCourses from './pages/Educator/MyCourses.jsx'
import StudentsEnrolled from './pages/Educator/StudentsEnrolled.jsx'
import NewCourseForm from './pages/Educator/NewCourseForm.jsx'
import StudentDoubts from './pages/Educator/StudentDoubts.jsx'
import Account from './pages/Account.jsx'
import Student from './pages/Student.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';


import { Toaster } from 'react-hot-toast'; // 👈 Add this import


function App() {

  // const location=useLocation();
  // const hideLayout=location.pathname.includes('/auth')
  const { isLoggedin } = useContext(AppContext);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/auth/:state" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Nested Student Layout (Includes student sidebar if logged in, top navbar if guest) */}
          <Route element={<Student />}>
            <Route path='/course-list' element={<CourseList />} />
            <Route path='/course-list/:input' element={<CourseList />} />
            <Route path='course/:id' element={<CourseDetails />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/courses' element={<AllCourses />} />
            <Route path='/my-enrollments' element={<MyEnrollments />} />
            <Route path='/account' element={<Account />} />
          </Route>

          <Route path='/player/:courseId' element={<Player />} />

          <Route path='/educator' element={<Educator />}>
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='add-course/form' element={<NewCourseForm />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
            <Route path='student-doubts' element={<StudentDoubts />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
