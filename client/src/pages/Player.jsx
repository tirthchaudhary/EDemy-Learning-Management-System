import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets2/assets.js'
import { AppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import humanizeDuration from 'humanize-duration'
import Footer from '../components/layout/Footer.jsx'
import Rating from '../components/common/Rating.jsx'
import Doubt from './Doubt.jsx'
import { getYouTubeId } from '../utils/youtube.js'
import { toast } from 'react-hot-toast';


const Player = () => {
  const { enrolledCourses, calculateChapterTime, courseProgress, toggleLectureProgress, userData, rateCourse } = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Optimization: using .find() is faster and cleaner than running a full .map() loop
  const getCourseData = () => {
    const matchedCourse = enrolledCourses.find(course => course._id.toString() === courseId.toString())
    setCourseData(matchedCourse || null)
  }

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Check if the currently active video is completed
  const activeProgressData = courseProgress.find(p => p.courseId === courseId);
  const isActiveLectureCompleted = playerData && activeProgressData && activeProgressData.completedLectures.includes(playerData.lectureId);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    // Displays a loading spinner toast
    const toastId = toast.loading("Submitting your review...");

    try {
      await rateCourse(courseId, rating, comment);

      // Replaces the loading spinner with a success checkmark
      toast.success("Review updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to submit review.", { id: toastId });
    }
  };


  useEffect(() => {
    if (courseData && userData) {
      const myReview = courseData.courseRatings?.find(
        r => (r.user?._id?.toString() || r.user?.toString()) === (userData?._id?.toString() || userData?.id?.toString())
      );
      if (myReview) {
        setRating(myReview.rating);
        setComment(myReview.comment || '');
      }
    }
  }, [courseData, userData]);

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses, courseId])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">

      {/* Core Classroom Dashboard Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Curriculum Structure Layout (7 / 12 width) */}
          <div className="w-full lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Classroom Mode</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {courseData ? courseData.courseTitle : 'Loading Course Curriculum...'}
              </h1>
            </div>

            {/* Course Syllabus Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Course Structure</h2>

              <div className="space-y-3">
                {courseData && courseData.courseContent.map((chapter, index) => {
                  const isSectionOpen = openSection[index];

                  return (
                    <div key={index} className="border border-slate-100 bg-white rounded-xl overflow-hidden transition-all duration-200">

                      {/* Accordion Trigger Header Bar */}
                      <div
                        onClick={() => toggleSection(index)}
                        className={`flex items-center justify-between px-5 py-4 cursor-pointer select-none transition-colors ${isSectionOpen ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={assets.down_arrow_icon}
                            alt="arrow-icon"
                            className={`w-3.5 h-3.5 opacity-50 transform transition-transform duration-200 ${isSectionOpen ? '' : '-rotate-90'
                              }`}
                          />
                          <p className="font-bold text-slate-800 text-sm md:text-base">{chapter.chapterTitle}</p>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 ml-4 whitespace-nowrap">
                          {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                        </p>
                      </div>

                      {/* Dropdown Lectures Under Accordion Panel */}
                      <div className={`overflow-hidden transition-all duration-300 ${isSectionOpen ? 'max-h-[600px] border-t border-slate-100' : 'max-h-0'}`}>
                        <ul className="divide-y divide-slate-50 bg-slate-50/10 px-4">
                          {chapter.chapterContent.map((lecture, i) => {
                            const isCurrentPlaying = playerData?.lectureUrl === lecture.lectureUrl;
                            const courseProgressData = courseProgress.find(p => p.courseId === courseId);
                            const isCompleted = courseProgressData && courseProgressData.completedLectures.includes(lecture.lectureId);
                            return (
                              <li key={i} className="flex items-center justify-between gap-4 py-3.5 px-2 group">
                                <div className="flex items-start gap-3 min-w-0">
                                  <img
                                    src={isCompleted ? assets.blue_tick_icon : assets.play_icon}
                                    alt="status icon"
                                    onClick={() => toggleLectureProgress(courseId, lecture.lectureId, !isCompleted)}
                                    className="w-4 h-4 mt-0.5 opacity-40 group-hover:opacity-70 transition-opacity flex-shrink-0 cursor-pointer"
                                  />
                                  <p className={`text-sm font-medium ${isCurrentPlaying ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                                    {lecture.lectureTitle}
                                  </p>
                                </div>

                                <div className="flex items-center space-x-4 flex-shrink-0">
                                  <p className="text-xs text-slate-400 font-medium">
                                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'], largest: 2 })}
                                  </p>
                                  {lecture.lectureUrl && (
                                    <button
                                      onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCurrentPlaying
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 shadow-2xs'
                                        }`}
                                    >
                                      {isCurrentPlaying ? 'Playing' : 'Watch'}
                                    </button>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC DOUBT DISCUSSIONS BOARD */}
            {playerData && (
              <Doubt 
                courseId={courseId} 
                lectureId={playerData.lectureId} 
                lectureTitle={playerData.lectureTitle}
              />
            )}

            {/* Course Rating Card block */}
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col">
              <h3 className="font-bold text-slate-900 text-lg">Write a Review</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">Your Rating:</span>
                <Rating initialRating={rating} onRate={(val) => setRating(val)} />
              </div>
              <textarea
                rows="3"
                placeholder="Share your thoughts about this course..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 resize-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all self-end cursor-pointer"
              >
                Submit Review
              </button>
            </form>

            {/* Course Reviews list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Course Reviews</h3>
              {!courseData || courseData.courseRatings?.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {courseData?.courseRatings?.map((rev, index) => (
                    <div key={index} className="pt-4 first:pt-0 flex items-start gap-4">
                      <img
                        src={rev.user?.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        alt={rev.user?.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-bold text-slate-800">{rev.user?.name || "Anonymous student"}</h5>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < rev.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{rev.comment}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">
                          {new Date(rev.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Video Media Streaming Terminal sticky block (5 / 12 width) */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-8 mb-6 lg:mb-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              {playerData ? (
                <div className="space-y-4">
                  {/* Rounded High-Performance Embedded Player Display Screen */}
                  <div className="rounded-xl overflow-hidden bg-black shadow-inner border border-slate-100 aspect-video">
                    <YouTube
                      videoId={getYouTubeId(playerData.lectureUrl)}
                      onEnd={() => toggleLectureProgress(courseId, playerData.lectureId, true)}
                      iframeClassName="w-full h-full aspect-video border-none"
                    />
                  </div>

                  {/* Meta Details Sub-panel */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        Ch {playerData.chapter} • Lec {playerData.lecture}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-2 leading-snug truncate">
                        {playerData.lectureTitle}
                      </h4>
                    </div>

                    <button
                      onClick={() => toggleLectureProgress(courseId, playerData.lectureId, !isActiveLectureCompleted)}
                      className={`cursor-pointer px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${isActiveLectureCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 hover:shadow-md'
                        }`}
                    >
                      {isActiveLectureCompleted ? '✓ Completed' : 'Mark as Completed'}
                    </button>
                  </div>

                </div>
              ) : (
                /* Unselected State / Dynamic Course Preview Thumbnail View */
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xs border border-slate-100 bg-slate-900 group">
                  {courseData?.courseThumbnail ? (
                    <>
                      <img
                        src={courseData.courseThumbnail.startsWith('http') ? courseData.courseThumbnail : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/${courseData.courseThumbnail}`}
                        alt="Course Display Frame"
                        className="w-full h-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                        <div className="bg-blue-600 text-white p-3.5 rounded-full shadow-lg mb-3 shadow-blue-500/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold tracking-widest uppercase opacity-80 text-blue-400">Ready to code?</p>
                        <p className="text-sm font-semibold max-w-xs mt-1 text-slate-200">
                          Select any lecture item from the system menu rows to launch the continuous stream video player.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium">
                      Loading class assets data...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>



      <Footer />
    </div>
  )
}

export default Player;