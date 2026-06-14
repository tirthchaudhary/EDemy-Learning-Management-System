import React, { useState, useContext } from 'react';
import Searchbar from '../components/common/Searchbar.jsx';
import { dummyCourses } from '../assets2/assets.js';
import CourseCard from '../components/common/CourseCard.jsx';
import { AppContext } from '../context/AppContext.jsx';

const AllCourses = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <div className='px-6 md:px-16 lg:px-24 py-8 bg-slate-50 min-h-screen'>
      <Searchbar />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Explore All Courses
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse our complete catalog of {allCourses.length} educational programs.
          </p>
        </div>
      </div>

      {/* Same structural responsive grid as your CourseList page */}
      {allCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No courses are available right now.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {allCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;