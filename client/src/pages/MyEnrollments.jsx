import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Line } from 'rc-progress';
import Footer from '../components/layout/Footer.jsx';
import { Link } from 'react-router-dom';
import { assets } from '../assets2/assets.js';
import Navbar from '../components/layout/Navbar.jsx';

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate, courseProgress, calculateNoOfLectures } = useContext(AppContext);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Enrollments
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your study progress and jump straight back into your lectures.
        </p>
      </div>

      {/* Responsive Content Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">

          {/* Table Header Section */}
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider max-sm:hidden">
            <tr>
              <th className="px-6 py-4 lg:w-1/2">Course Details</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Completed</th>
              <th className="px-6 py-4 text-right pr-8">Status / Action</th>
            </tr>
          </thead>

          {/* Table Body Section */}
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {enrolledCourses.map((course, index) => {
              // Look up the database progress folder for this specific course
              const courseProgressData = courseProgress.find(p => p.courseId === course._id);

              // Calculate counts
              const totalLectures = calculateNoOfLectures(course);
              const lectureCompleted = courseProgressData ? courseProgressData.completedLectures.length : 0;

              // Compute percent
              const progressPercent = totalLectures > 0 ? Math.round((lectureCompleted / totalLectures) * 100) : 0;
              const isFinished = progressPercent === 100;
              return (
                <tr
                  key={course._id || index}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Column 1: Card Thumbnail + Inline Responsive Tracking Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      {/* Image Frame Wrapper */}
                      <div className="relative flex-shrink-0 w-20 sm:w-28 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm group-hover:scale-102 transition-transform duration-200">
                        <img
                          src={course.courseThumbnail.startsWith('http') ? course.courseThumbnail : `http://localhost:3000/${course.courseThumbnail}`}
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Title & Progress Slider */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate pr-2 max-sm:text-sm max-sm:whitespace-normal max-sm:line-clamp-2">
                          {course.courseTitle}
                        </h3>

                        {/* Mini Layout details visible strictly on Mobile Screens */}
                        <div className="sm:hidden flex items-center space-x-2 text-xs text-slate-400 mt-1 mb-2">
                          <span>{calculateCourseDuration(course)}</span>
                          <span>•</span>
                          <span>{lectureCompleted}/{totalLectures} Lectures</span>
                        </div>

                        <div className="mt-2 max-w-xs flex items-center space-x-3">
                          <div className="flex-1">
                            <Line
                              strokeWidth={2.5}
                              percent={progressPercent}
                              strokeColor={isFinished ? "#10b981" : "#2563eb"}
                              trailColor="#e2e8f0"
                              trailWidth={2.5}
                              className="rounded-full"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 w-8 text-right">
                            {progressPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Class Duration Data */}
                  <td className="px-6 py-5 font-medium text-slate-600 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>

                  {/* Column 3: Lecture Completions Count */}
                  <td className="px-6 py-5 text-slate-500 max-sm:hidden">
                    <span className="font-semibold text-slate-800">
                      {lectureCompleted}
                    </span>
                    <span className="text-slate-400">/{totalLectures}</span>
                    <span className="ml-1 text-xs text-slate-400">lectures</span>
                  </td>

                  {/* Column 4: Dynamic Call To Actions + Badges */}
                  <td className="px-6 py-5 text-right pr-6 sm:pr-8">
                    <div className="flex flex-col sm:items-end justify-center space-y-2">
                      {/* Status Label Pill */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-end ${isFinished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isFinished ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                        {isFinished ? 'Completed' : 'On Going'}
                      </span>

                      {/* Action Navigation Button */}
                      <button
                        onClick={() => navigate('/player/' + course._id)}
                        className={`cursor-pointer w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${isFinished
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 hover:shadow-md'
                          }`}
                      >
                        {isFinished ? 'Review Course' : 'Resume Learning'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default MyEnrollments;