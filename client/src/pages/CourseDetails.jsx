import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx';
import Loading from '../components/common/Loading.jsx';
import { assets } from '../assets2/assets.js';
import humanizeDuration from 'humanize-duration';
import Footer from '../components/layout/Footer.jsx';
import Youtube from 'react-youtube'
import PlayerOrThumbnail from '../components/PlayerOrThubnail.jsx';
import axios from 'axios';
import { loadRazorpayScript } from '../utils/loadScript';
import { getYouTubeId } from '../utils/youtube.js';
import { toast } from 'react-hot-toast';

const CourseDetails = () => {

  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { allCourses, calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses, navigate, isLoggedIn } = useContext(AppContext)
  const [playerData, setPlayerData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id.toString() === id.toString());
    setCourseData(findCourse);
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses])

  useEffect(() => {
    if (courseData && enrolledCourses) {
      const enrolled = enrolledCourses.some(course => course._id.toString() === courseData._id.toString());
      setIsEnrolled(enrolled);
    } else {
      setIsEnrolled(false);
    }
  }, [courseData, enrolledCourses]);

  const handleEnrollment = async (courseId) => {
    if (!isLoggedIn) {
      toast.error("Please login to enroll in courses.");
      navigate('/auth/login');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const orderResponse = await axios.post(
        'http://localhost:3000/api/payment/create-order',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        toast.error("Error creating payment order");
        return;
      }

      const { orderId, amount, currency, courseName } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_yourKeyHere',
        amount: amount,
        currency: currency,
        name: "EDemy",
        description: `Enrolling in ${courseName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              'http://localhost:3000/api/payment/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              toast.success("Enrollment successful!");
              await fetchUserEnrolledCourses();
              navigate('/my-enrollments');
            } else {
              toast.error("Payment verification failed: " + verifyResponse.data.message);
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: "",
          email: ""
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || "Failed to start payment process");
    }
  };


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return courseData ? (
    <>
      {/* Hero Background */}
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 px-6 md:px-20 lg:px-32 pt-24 pb-32'>
          <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start justify-between'>

            {/* Left — Hero Text */}
            <div className='flex-1 text-white max-w-2xl'>

              {/* Badge */}
              <span className='inline-block bg-indigo-500/30 text-indigo-200 text-xs font-medium px-3 py-1 rounded-full mb-4 border border-indigo-400/30'>
                Online Course
              </span>

              <h1 className='text-2xl md:text-4xl font-bold leading-tight text-white'>
                {courseData.courseTitle}
              </h1>

              <p
                className='mt-4 text-indigo-200 text-sm md:text-base leading-relaxed line-clamp-3'
                dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}
              />

              {/* Rating Row */}
              <div className='flex flex-wrap items-center gap-3 mt-5'>
                <div className='flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full'>
                  <span className='text-amber-400 font-semibold text-sm'>{calculateRating(courseData)}</span>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <img className='w-3 h-3' key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='star' />
                    ))}
                  </div>
                  <span className='text-indigo-200 text-xs'>({courseData.courseRatings.length} ratings)</span>
                </div>
                <div className='flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-indigo-200'>
                  <img src={assets.lesson_icon} alt='students' className='w-3.5 h-3.5 opacity-70' />
                  {courseData.enrolledStudent.length} students
                </div>
              </div>

              <p className='mt-3 text-sm text-indigo-300'>
                Course by <span className='text-white font-medium underline underline-offset-2'>Edemy Educator</span>
              </p>

              {/* Stats Strip */}
              <div className='flex flex-wrap gap-4 mt-6 text-sm text-indigo-200'>
                <div className='flex items-center gap-1.5'>
                  <img src={assets.time_clock_icon} alt='duration' className='w-4 h-4 opacity-60' />
                  {calculateCourseDuration(courseData)}
                </div>
                <div className='w-px h-4 bg-indigo-500/50 self-center'></div>
                <div className='flex items-center gap-1.5'>
                  <img src={assets.lesson_icon} alt='lessons' className='w-4 h-4 opacity-60' />
                  {calculateNoOfLectures(courseData)} lessons
                </div>
                <div className='w-px h-4 bg-indigo-500/50 self-center'></div>
                <div className='flex items-center gap-1.5'>
                  <img src={assets.star} alt='rating' className='w-4 h-4 opacity-60' />
                  {calculateRating(courseData)} rating
                </div>
              </div>
            </div>

            {/* Right — Card (desktop, overlaps hero) */}
            <div className='hidden md:block w-full max-w-sm lg:max-w-md flex-shrink-0'>
              <div className='bg-white rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/40 sticky top-24'>
                {!isMobile && (
                  <div className='w-full max-w-sm lg:max-w-md flex-shrink-0'>
                    <div className='bg-white rounded-2xl overflow-hidden shadow-2xl sticky top-24'>
                      <PlayerOrThumbnail playerData={playerData} CourseData={courseData} />
                    </div>
                  </div>
                )}
                <div className='p-5'>
                  {/* Urgency */}
                  <div className='flex items-center gap-1.5 text-xs text-red-500 font-medium mb-3'>
                    <img className='w-3.5' src={assets.time_left_clock_icon} alt='clock' />
                    <span className='font-bold'>5 days</span> left at this price!
                  </div>

                  {/* Price */}
                  <div className='flex items-baseline gap-2 mb-1'>
                    <span className='text-3xl font-bold text-gray-900'>
                      ₹{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                    </span>
                    <span className='text-gray-400 line-through text-sm'>₹{courseData.coursePrice}</span>
                    <span className='text-green-600 text-sm font-medium'>{courseData.discount}% off</span>
                  </div>

                  {/* Mini stats */}
                  <div className='flex items-center gap-3 text-xs text-gray-500 py-3 border-y border-gray-100 my-3'>
                    <div className='flex items-center gap-1'>
                      <img src={assets.star} alt='' className='w-3.5' />
                      {calculateRating(courseData)}
                    </div>
                    <div className='w-px h-3 bg-gray-300'></div>
                    <div className='flex items-center gap-1'>
                      <img src={assets.time_clock_icon} alt='' className='w-3.5' />
                      {calculateCourseDuration(courseData)}
                    </div>
                    <div className='w-px h-3 bg-gray-300'></div>
                    <div className='flex items-center gap-1'>
                      <img src={assets.lesson_icon} alt='' className='w-3.5' />
                      {calculateNoOfLectures(courseData)} lessons
                    </div>
                  </div>

                  <button
                    onClick={() => isEnrolled ? navigate('/my-enrollments') : handleEnrollment(courseData._id)}
                    className='w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors duration-200 shadow-md shadow-indigo-200 cursor-pointer'
                  >
                    {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                  </button>

                  {/* Includes */}
                  <div className='mt-5'>
                    <p className='text-sm font-semibold text-gray-800 mb-2'>This course includes:</p>
                    <ul className='space-y-1.5 text-xs text-gray-500'>
                      {['Lifetime access with free updates', 'Step-by-step, hands-on project guidance.', 'Downloadable resources and source code.', 'Quizzes to test your knowledge.', 'Certificate of completion.'].map((item, i) => (
                        <li key={i} className='flex items-start gap-2'>
                          <span className='text-indigo-500 mt-0.5'>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-6 md:px-20 lg:px-32 -mt-16'>
          <div className='flex flex-col md:flex-row gap-10 items-start'>

            {/* Left Content */}
            <div className='flex-1 min-w-0'>

              {/* Mobile Card */}
              <div className='md:hidden bg-white rounded-2xl overflow-hidden shadow-lg mb-8'>
                {isMobile && (
                  <div className='bg-white rounded-2xl overflow-hidden shadow-lg mb-8'>
                    <PlayerOrThumbnail playerData={playerData} CourseData={courseData} />
                  </div>
                )}
                <div className='p-4'>
                  <div className='flex items-baseline gap-2 mb-3'>
                    <span className='text-2xl font-bold text-gray-900'>
                      ₹{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                    </span>
                    <span className='text-gray-400 line-through text-sm'>₹{courseData.coursePrice}</span>
                    <span className='text-green-600 text-sm font-medium'>{courseData.discount}% off</span>
                  </div>
                  <button
                    onClick={() => isEnrolled ? navigate('/my-enrollments') : handleEnrollment(courseData._id)}
                    className='w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm cursor-pointer'
                  >
                    {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                  </button>
                </div>
              </div>

              {/* Course Structure */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-5'>Course Structure</h2>
                <div className='space-y-2'>
                  {courseData.courseContent.map((chapter, index) => (
                    <div key={index} className='border border-gray-200 rounded-xl overflow-hidden'>
                      <div
                        onClick={() => toggleSection(index)}
                        className='flex items-center justify-between px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50 transition-colors'
                      >
                        <div className='flex items-center gap-3'>
                          <img
                            src={assets.down_arrow_icon}
                            alt='arrow'
                            className={`w-4 h-4 transform transition-transform duration-200 ${openSection[index] ? 'rotate-180' : ''}`}
                          />
                          <p className='font-medium text-gray-800 text-sm md:text-base'>{chapter.chapterTitle}</p>
                        </div>
                        <p className='text-xs text-gray-400 whitespace-nowrap ml-2'>
                          {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                        </p>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                        <ul className='border-t border-gray-100 divide-y divide-gray-50'>
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex items-center justify-between px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50'>
                              <div className='flex items-center gap-2.5'>
                                <img src={assets.play_icon} alt='play' className='w-3.5 h-3.5 opacity-50' />
                                <span className='text-xs md:text-sm'>{lecture.lectureTitle}</span>
                              </div>
                              <div className='flex items-center gap-3 flex-shrink-0 ml-2'>
                                {lecture.isPreviewFree && (
                                  <span
                                    onClick={() => setPlayerData({ videoId: getYouTubeId(lecture.lectureUrl) })}
                                    className='text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer font-medium'
                                  >
                                    Preview
                                  </span>
                                )}
                                <span className='text-xs text-gray-400'>
                                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10'>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>Course Description</h3>
                <div
                  className='prose prose-sm max-w-none text-gray-600 leading-relaxed rich-text'
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                />
              </div>

              {/* Public Reviews Section */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>What Students Say</h3>
                {courseData.courseRatings?.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No reviews yet for this course.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courseData.courseRatings.map((rev, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex gap-4">
                        <img
                          src={rev.user?.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                          alt={rev.user?.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-gray-800">{rev.user?.name || "Student"}</h5>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < rev.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{rev.comment}</p>
                          <span className="text-[10px] text-gray-400 block mt-2">{new Date(rev.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>


            {/* Right sticky spacer on desktop (card is in hero) */}
            <div className='hidden md:block w-full max-w-sm lg:max-w-md flex-shrink-0'></div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails